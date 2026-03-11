const state = {
  email: localStorage.getItem("email") || "",
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  role: localStorage.getItem("role") || "",
}

const elements = {
  step1Form: document.getElementById("step1-form"),
  step2Form: document.getElementById("step2-form"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  codigo: document.getElementById("codigo"),
  output: document.getElementById("output"),
  messageBox: document.getElementById("message-box"),
  activeEmail: document.getElementById("active-email"),
  activeRole: document.getElementById("active-role"),
  loadPanel: document.getElementById("load-panel"),
  refreshSession: document.getElementById("refresh-session"),
  logout: document.getElementById("logout"),
}

elements.email.value = state.email
paintSession()

elements.step1Form.addEventListener("submit", async (event) => {
  event.preventDefault()

  const email = elements.email.value.trim()
  const password = elements.password.value.trim()

  try {
    const data = await request("/login-paso1", {
      method: "POST",
      body: { email, password },
    })

    state.email = email
    localStorage.setItem("email", email)
    paintSession()
    showMessage(data.mensaje, "success")
    renderOutput(data)
  } catch (error) {
    showMessage(error.message, "error")
  }
})

elements.step2Form.addEventListener("submit", async (event) => {
  event.preventDefault()

  try {
    const data = await request("/login-paso2", {
      method: "POST",
      body: {
        email: state.email || elements.email.value.trim(),
        codigo: elements.codigo.value.trim(),
      },
    })

    state.accessToken = data.accessToken
    state.refreshToken = data.refreshToken
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)

    const payload = parseJwt(data.accessToken)
    state.role = payload?.rol || ""
    localStorage.setItem("role", state.role)

    paintSession()
    showMessage("Sesion iniciada correctamente.", "success")
    renderOutput({
      rolDetectado: state.role,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
  } catch (error) {
    showMessage(error.message, "error")
  }
})

elements.loadPanel.addEventListener("click", async () => {
  if (!state.accessToken) {
    showMessage("Primero debes completar el login.", "error")
    return
  }

  const endpoint = state.role === "admin" ? "/dashboard-admin" : "/mi-espacio"

  try {
    const data = await request(endpoint, {
      method: "GET",
      token: state.accessToken,
    })

    renderOutput(data)
    showMessage("Panel cargado.", "success")
  } catch (error) {
    showMessage(error.message, "error")
  }
})

elements.refreshSession.addEventListener("click", async () => {
  if (!state.refreshToken) {
    showMessage("No hay refresh token almacenado.", "error")
    return
  }

  try {
    const data = await request("/refresh-token", {
      method: "POST",
      body: { refreshToken: state.refreshToken },
    })

    state.accessToken = data.accessToken
    localStorage.setItem("accessToken", data.accessToken)
    const payload = parseJwt(data.accessToken)
    state.role = payload?.rol || state.role
    localStorage.setItem("role", state.role)

    paintSession()
    renderOutput(data)
    showMessage("Access token renovado.", "success")
  } catch (error) {
    showMessage(error.message, "error")
  }
})

elements.logout.addEventListener("click", () => {
  state.accessToken = ""
  state.refreshToken = ""
  state.role = ""
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("role")
  paintSession()
  renderOutput({ mensaje: "Sesion cerrada localmente." })
  showMessage("Sesion limpiada en el navegador.", "success")
})

async function request(url, options) {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.mensaje || "La solicitud fallo.")
  }

  return data
}

function paintSession() {
  elements.activeEmail.textContent = state.email || "Sin definir"
  elements.activeRole.textContent = state.role || "Sin sesion"
}

function renderOutput(data) {
  elements.output.textContent = JSON.stringify(data, null, 2)
}

function showMessage(message, type) {
  elements.messageBox.textContent = message
  elements.messageBox.className = `message ${type}`
}

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1]
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}
