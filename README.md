# 📚 Sistema de Seguridad - Biblioteca

Frontend completo para el sistema de seguridad y gestión de biblioteca con autenticación en 2 pasos (2FA).

## 📋 Archivos Creados

### 1. **index.html** - Página de Login
- Formulario de login con dos pasos:
  - Paso 1: Email y contraseña
  - Paso 2: Verificación con código 2FA enviado al correo
- Diseño moderno y responsivo
- Interfaz atractiva con gradientes y animaciones

### 2. **dashboard.html** - Panel Principal
- Navbar con información del usuario y botón de cerrar sesión
- Sidebar con menú de navegación
- Secciones dinámicas:
  - **Mis Libros**: Muestra los libros asignados al usuario
  - **Mi Perfil**: Información personal del usuario
  - **Gestionar Usuarios** (solo para admins): Tabla de usuarios
  - **Estadísticas** (solo para admins): Gráficas de estadísticas

### 3. **styles.css** - Estilos Completos
- Variables CSS para fácil personalización
- Diseño responsivo (mobile, tablet, desktop)
- Animaciones suaves
- Temas de colores profesionales
- Grid y flexbox moderno

### 4. **script.js** - Lógica del Login
- Manejo del login en 2 pasos
- Comunicación con la API backend
- Almacenamiento de token en localStorage
- Gestión de errores
- Validación de formularios

### 5. **dashboard.js** - Lógica del Dashboard
- Verificación de autenticación
- Carga dinámica de información del usuario
- Mostrar/ocultar secciones según el rol (admin/estudiante)
- Gestión de navegación entre secciones
- Cierre de sesión

## 🚀 Cómo Usar

### Paso 1: Asegúrate que el backend está corriendo
```bash
node server.js
```
El servidor debe estar en `http://localhost:3000`

### Paso 2: Abre los archivos HTML en el navegador

**Opción 1: Servidor local (Recomendado)**
```bash
# Con Python
python -m http.server 8000

# Con Node.js + http-server
npx http-server
```
Luego abre `http://localhost:8000` (o el puerto que uses)

**Opción 2: Directamente en el navegador**
- Abre `index.html` directamente en tu navegador
- (Nota: Algunos navegadores pueden tener restricciones CORS)

### Paso 3: Credenciales de Prueba

**Admin:**
- Email: `samuelibbbbb@gmail.com`
- Contraseña: `1234`
- Recibirá un código 2FA por correo

**Estudiante:**
- Email: `samuelibbbbb@gmail.com`
- Contraseña: `1234`
- Recibirá un código 2FA por correo

## 🎨 Características del Diseño

### Login Page
- ✅ Diseño moderno con gradientes
- ✅ Animaciones suaves al cargar
- ✅ Dos pasos claramente definidos
- ✅ Validación de formularios
- ✅ Mensajes de error descriptivos
- ✅ Spinner de carga

### Dashboard
- ✅ Navbar sticky con información del usuario
- ✅ Sidebar con menú colapsible en móvil
- ✅ Secciones dinámicas con animations
- ✅ Grid responsive para libros
- ✅ Tarjetas de estadísticas
- ✅ Tabla de usuarios (admin)
- ✅ Diseño totalmente responsivo

## 📱 Responsividad

- **Desktop**: Ancho completo con sidebar lateral
- **Tablet**: Menús reordenados, grid adaptado
- **Mobile**: Navbar con menú horizontal, contenido a pantalla completa

## 🔐 Seguridad

- ✅ Tokens almacenados en localStorage
- ✅ Verificación de autenticación en dashboard
- ✅ Destrucción de datos al cerrar sesión
- ✅ Validación de formularios cliente
- ✅ Manejo de errores de API

## 🎯 Personalización

### Cambiar Colores
En `styles.css`, modifica las variables CSS:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    /* etc */
}
```

### Agregar Más Menús
En `dashboard.html`, agrega items al `<ul>` dentro de `.menu`:
```html
<li><a href="#" class="menu-item" data-section="nueva-seccion">🔗 Mi Menú</a></li>
```

### Conexión API Real
Modifica `const API_URL` en `script.js` y `dashboard.js` si el backend está en otro puerto/dominio

## 📝 Notas

- El código 2FA de prueba se mostrará en la consola del backend
- Los datos de usuarios y libros están simulados
- Para producción, implementa una base de datos real

## ✨ Mejoras Futuras

- [ ] Sistema de búsqueda de libros
- [ ] Filtros avanzados en tabla de usuarios
- [ ] Gráficos reales de estadísticas
- [ ] Sistema de notificaciones
- [ ] Dark mode
- [ ] Exportación de reportes

---

**Desarrollado por:** Tu nombre
**Proyecto:** Sistema de Seguridad de Biblioteca
