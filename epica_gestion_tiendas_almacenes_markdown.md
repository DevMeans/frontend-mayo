# 🟦 ÉPICA — Gestión de tiendas y almacenes

## 🎯 Objetivo
Permitir administrar tiendas y almacenes del sistema para controlar inventario, transferencias y operaciones multitienda.

---

# 🟡 US-ST1 — Crear tienda o almacén

## 📌 Summary
Crear tienda o almacén

---

## 📝 Description

```text
## Descripción
Como administrador quiero crear tiendas o almacenes para gestionar inventario y operaciones del sistema.

## UX / Interfaz

### Modal creación

Campos:
- nombre
- código
- tipo
- dirección

### Tipo
- STORE
- WAREHOUSE

### Acciones
- guardar
- cancelar

---

## Reglas de negocio

- El nombre es obligatorio
- El código es obligatorio
- El código debe ser único
- El tipo es obligatorio
- La tienda se crea activa por defecto

---

## Criterios de aceptación

- Puedo crear tiendas
- Puedo crear almacenes
- No permite códigos duplicados
- No permite campos obligatorios vacíos
- La tienda queda registrada correctamente
```

---

## 🔴 Subtareas

### 🧱 DB
- Crear enum `StoreType`
- Actualizar tabla `Store`

---

### ⚙️ Backend
- POST /stores
- Validaciones

---

### 🎨 Frontend
- Modal creación
- Formulario

---

### 🔗 Integración
- Consumir endpoint
- Actualizar listado

---

# 🟡 US-ST2 — Listar tiendas y almacenes

## 📌 Summary
Listar tiendas y almacenes

---

## 📝 Description

```text
## Descripción
Como administrador quiero visualizar tiendas y almacenes registrados para gestionarlos.

## UX / Interfaz

### Página
/stores

### Tabla
Mostrar:
- nombre
- código
- tipo
- dirección
- estado

### Acciones
- editar
- eliminar

### Filtros
- búsqueda
- tipo
- incluir inactivos

---

## Reglas de negocio

- Por defecto solo se muestran activos
- La búsqueda debe ser parcial
- La búsqueda no distingue mayúsculas/minúsculas

---

## Criterios de aceptación

- Puedo visualizar tiendas
- Puedo visualizar almacenes
- Puedo buscar por nombre
- Puedo filtrar por tipo
- Puedo incluir inactivos
```

---

## 🔴 Subtareas

### ⚙️ Backend
- GET /stores
- filtros y búsqueda

---

### 🎨 Frontend
- tabla stores
- filtros
- búsqueda

---

### 🔗 Integración
- consumir API
- actualizar listado

---

# 🟡 US-ST3 — Editar tienda o almacén

## 📌 Summary
Editar tienda o almacén

---

## 📝 Description

```text
## Descripción
Como administrador quiero editar tiendas o almacenes para mantener información actualizada.

## UX / Interfaz

### Modal edición

Campos:
- nombre
- código
- tipo
- dirección

---

## Reglas de negocio

- El código debe seguir siendo único
- La tienda debe existir

---

## Criterios de aceptación

- Puedo editar información
- Los cambios se guardan correctamente
- No permite códigos duplicados
```

---

## 🔴 Subtareas

### ⚙️ Backend
- PUT /stores/:id

---

### 🎨 Frontend
- modal edición

---

### 🔗 Integración
- actualizar información

---

# 🟡 US-ST4 — Desactivar tienda o almacén

## 📌 Summary
Desactivar tienda o almacén

---

## 📝 Description

```text
## Descripción
Como administrador quiero desactivar tiendas o almacenes para evitar nuevas operaciones.

## UX / Interfaz

### Acciones
- botón eliminar/desactivar
- modal confirmación

---

## Reglas de negocio

- No se elimina físicamente
- Se usa isActive = false
- Una tienda inactiva no puede:
  - recibir stock
  - transferir stock
  - vender productos

---

## Criterios de aceptación

- Puedo desactivar tiendas
- La tienda desaparece de listados activos
- La tienda permanece en base de datos
```

---

## 🔴 Subtareas

### ⚙️ Backend
- DELETE /stores/:id
- soft delete

---

### 🎨 Frontend
- modal confirmación

---

### 🔗 Integración
- actualizar listado

---

# 🟡 US-ST5 — Buscar tiendas y almacenes

## 📌 Summary
Buscar tiendas

---

## 📝 Description

```text
## Descripción
Como administrador quiero buscar tiendas rápidamente para encontrarlas fácilmente.

## UX / Interfaz

### Filtros
- input búsqueda
- filtro tipo
- checkbox incluir inactivos

---

## Reglas de negocio

- La búsqueda debe ser parcial
- No distingue mayúsculas/minúsculas

---

## Criterios de aceptación

- Puedo buscar por nombre
- Puedo filtrar por tipo
- Puedo incluir inactivos
- El listado se actualiza dinámicamente
```

---

## 🔴 Subtareas

### ⚙️ Backend
- query params búsqueda

---

### 🎨 Frontend
- filtros dinámicos

---

### 🔗 Integración
- actualización dinámica

---

# 🧠 REGLAS IMPORTANTES DEL SISTEMA

## StoreType

```text
STORE
WAREHOUSE
```

---

# 🧠 DIFERENCIA

## STORE
- vende productos
- POS
- ecommerce pickup

---

## WAREHOUSE
- almacenamiento
- distribución
- transferencias

---

# 🧠 RELACIÓN CON INVENTARIO

Cada registro de inventario pertenece a:

```text
Store + ProductVariant
```

---

# 🧠 RESULTADO FINAL

👉 Ya tienes:

✔ gestión de tiendas
✔ gestión de almacenes
✔ multitienda real
✔ base para inventario
✔ transferencias
✔ POS
✔ ecommerce pickup
✔ UX definido
✔ reglas de negocio
✔ criterios de aceptación
✔ subtareas listas para Jira

