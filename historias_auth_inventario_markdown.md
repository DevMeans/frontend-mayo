# 🟦 ÉPICA — Gestión de autenticación y usuarios

## 🎯 Objetivo
Permitir autenticación, control de acceso y trazabilidad de usuarios dentro del sistema ERP/Ecommerce.

---

# 🟡 US-AUTH-1 — Iniciar sesión

## 📌 Summary
Login de usuario

## 📝 Description

```text
## Descripción
Como usuario quiero iniciar sesión para acceder al sistema según mis permisos.

## UX / Interfaz

### Página
/login

### Campos
- correo electrónico
- contraseña

### Acciones
- iniciar sesión
- mostrar/ocultar contraseña

---

## Reglas de negocio

- El correo debe existir
- La contraseña debe ser válida
- Solo usuarios activos pueden iniciar sesión
- El sistema debe generar JWT
- El sistema debe guardar sesión autenticada

---

## Criterios de aceptación

- Puedo ingresar correo y contraseña
- Puedo iniciar sesión correctamente
- El sistema genera token JWT
- No permite credenciales inválidas
- No permite usuarios inactivos
```

## 🔴 Subtareas

### 🧱 DB
- Crear tabla User
- Crear tabla Role

### ⚙️ Backend
- POST /auth/login
- JWT
- Guards
- Hash password

### 🎨 Frontend
- Página login
- Validaciones

### 🔗 Integración
- Guardar token
- Redirección dashboard

---

# 🟡 US-AUTH-2 — Cerrar sesión

## 📌 Summary
Cerrar sesión

## 📝 Description

```text
## Descripción
Como usuario quiero cerrar sesión para proteger mi cuenta.

## UX / Interfaz
- Botón cerrar sesión
- Confirmación opcional

---

## Reglas de negocio
- El token debe invalidarse localmente
- El usuario debe regresar al login

---

## Criterios de aceptación
- Puedo cerrar sesión
- El sistema elimina la sesión
- Soy redirigido al login
```

## 🔴 Subtareas

### ⚙️ Backend
- lógica logout

### 🎨 Frontend
- botón logout

### 🔗 Integración
- limpiar token

---

# 🟡 US-AUTH-3 — Crear usuario

## 📌 Summary
Crear usuario

## 📝 Description

```text
## Descripción
Como administrador quiero crear usuarios para permitir acceso al sistema.

## UX / Interfaz

### Modal creación usuario
Campos:
- nombres
- apellidos
- correo
- contraseña
- rol

---

## Reglas de negocio
- El correo debe ser único
- La contraseña es obligatoria
- El rol es obligatorio
- El usuario se crea activo por defecto
- La contraseña debe almacenarse encriptada

---

## Criterios de aceptación
- Puedo crear usuarios
- No permite correos duplicados
- El usuario queda registrado
- La contraseña queda encriptada
```

## 🔴 Subtareas

### 🧱 DB
- relaciones User y Role

### ⚙️ Backend
- POST /users
- hash password

### 🎨 Frontend
- modal usuario

### 🔗 Integración
- guardar usuario

---

# 🟡 US-AUTH-4 — Gestionar roles

## 📌 Summary
Gestionar roles

## 📝 Description

```text
## Descripción
Como administrador quiero gestionar roles para controlar permisos del sistema.

## UX / Interfaz
- Tabla roles
- CRUD roles

---

## Reglas de negocio
- El nombre del rol debe ser único
- Un usuario pertenece a un rol

---

## Criterios de aceptación
- Puedo crear roles
- Puedo editar roles
- Puedo visualizar roles
```

## 🔴 Subtareas

### 🧱 DB
- tabla Role

### ⚙️ Backend
- CRUD roles

### 🎨 Frontend
- gestión roles

### 🔗 Integración
- consumir endpoints

---

# 🟡 US-AUTH-5 — Proteger rutas por rol

## 📌 Summary
Protección por roles

## 📝 Description

```text
## Descripción
Como sistema quiero restringir acceso según el rol del usuario.

## UX / Interfaz
- Menú dinámico según permisos

---

## Reglas de negocio
- ADMIN tiene acceso total
- WAREHOUSE accede inventario
- SELLER accede ventas
- Las rutas deben validarse con guards

---

## Criterios de aceptación
- Usuarios solo acceden a módulos permitidos
- El sistema bloquea accesos inválidos
```

## 🔴 Subtareas

### ⚙️ Backend
- Role guards
- JWT guards

### 🎨 Frontend
- ocultar menú según rol

### 🔗 Integración
- validación permisos

---

# 🟦 ÉPICA — Gestión de inventario

## 🎯 Objetivo
Controlar stock, movimientos, reservas y transferencias dentro del sistema multitienda.

---

# 🟡 US-I1 — Visualizar stock por tienda

## 📌 Summary
Visualizar stock

## 📝 Description

```text
## Descripción
Como administrador quiero visualizar el stock por tienda para conocer disponibilidad real.

## UX / Interfaz

### Página
/inventory

### Tabla
- producto
- variante
- tienda
- stock total
- stock reservado
- stock disponible

### Filtros
- búsqueda producto
- filtro tienda
- incluir stock 0

---

## Reglas de negocio
- El stock pertenece a una tienda
- El stock se controla por variante
- Stock disponible = stock total - reservado
- El stock no puede ser negativo

---

## Criterios de aceptación
- Puedo visualizar stock
- Puedo visualizar stock reservado
- Puedo filtrar por tienda
- El listado se actualiza correctamente
```

## 🔴 Subtareas

### 🧱 DB
- tabla Inventory

### ⚙️ Backend
- GET /inventory

### 🎨 Frontend
- tabla inventario

### 🔗 Integración
- consumir API

---

# 🟡 US-I2 — Registrar movimientos de inventario

## 📌 Summary
Registrar movimiento

## 📝 Description

```text
## Descripción
Como administrador quiero registrar movimientos de inventario para mantener trazabilidad.

## UX / Interfaz

### Modal movimiento
Campos:
- tienda
- variante
- cantidad
- tipo
- observación

### Tipos
- ingreso
- salida
- ajuste

---

## Reglas de negocio
- Todo movimiento debe registrarse
- El movimiento debe registrar responsable
- La cantidad debe ser mayor a 0
- No se permite salida mayor al stock disponible
- El stock debe actualizarse automáticamente

---

## Criterios de aceptación
- Puedo registrar movimientos
- El stock se actualiza correctamente
- El responsable queda registrado
```

## 🔴 Subtareas

### 🧱 DB
- tabla InventoryMovement

### ⚙️ Backend
- POST /inventory/movements

### 🎨 Frontend
- modal movimiento

### 🔗 Integración
- actualizar inventario

---

# 🟡 US-I3 — Transferir stock entre tiendas

## 📌 Summary
Transferir stock

## 📝 Description

```text
## Descripción
Como administrador quiero transferir stock entre tiendas.

## UX / Interfaz

### Página transferencia
Campos:
- tienda origen
- tienda destino
- productos
- cantidades

### Estados
- pendiente
- en tránsito
- recibido

---

## Reglas de negocio
- La tienda origen debe tener stock suficiente
- La transferencia registra responsable
- El stock pasa a tránsito
- El stock destino aumenta al recibir

---

## Criterios de aceptación
- Puedo crear transferencia
- El stock origen disminuye
- El stock queda en tránsito
- Puedo recibir transferencia
- El stock destino aumenta
```

## 🔴 Subtareas

### 🧱 DB
- StockTransfer
- StockTransferItem

### ⚙️ Backend
- POST /transfers
- PATCH receive transfer

### 🎨 Frontend
- formulario transferencia

### 🔗 Integración
- actualización estados

---

# 🟡 US-I4 — Gestionar responsabilidad de stock

## 📌 Summary
Gestionar responsables

## 📝 Description

```text
## Descripción
Como administrador quiero visualizar responsables del stock.

## UX / Interfaz

### Vista movimientos
Mostrar:
- usuario origen
- usuario destino
- producto
- cantidad
- fecha

---

## Reglas de negocio
- Todo movimiento debe registrar responsable
- Debe existir historial completo

---

## Criterios de aceptación
- Puedo visualizar responsables
- El historial queda registrado
```

## 🔴 Subtareas

### 🧱 DB
- responsibleUserId

### ⚙️ Backend
- historial movimientos

### 🎨 Frontend
- vista responsables

### 🔗 Integración
- render historial

---

# 🟡 US-I5 — Reservar stock

## 📌 Summary
Reservar stock

## 📝 Description

```text
## Descripción
Como sistema quiero reservar stock automáticamente cuando un pedido entra en preparación.

## UX / Interfaz

### Vista inventario
Mostrar:
- stock total
- stock reservado
- stock disponible

---

## Reglas de negocio
- El stock reservado reduce stock disponible
- No se puede reservar más stock del disponible
- La reserva debe asociarse a un pedido

---

## Criterios de aceptación
- El stock reservado aumenta
- El stock disponible disminuye
- La reserva queda asociada al pedido
```

## 🔴 Subtareas

### 🧱 DB
- tabla Reservation

### ⚙️ Backend
- lógica reservas

### 🎨 Frontend
- visualización reservas

### 🔗 Integración
- actualización inventario

---

# 🟡 US-I6 — Picking y preparación de pedidos

## 📌 Summary
Gestionar picking

## 📝 Description

```text
## Descripción
Como empleado quiero separar productos para preparar pedidos.

## UX / Interfaz

### Página picking
Mostrar:
- pedido
- productos
- cantidades
- estado

### Acciones
- iniciar picking
- marcar separado
- finalizar preparación

---

## Reglas de negocio
- El picking debe asociarse a un pedido
- Debe registrarse responsable
- Debe mantenerse trazabilidad

---

## Criterios de aceptación
- Puedo iniciar picking
- Puedo separar productos
- Puedo finalizar preparación
- El sistema registra responsable
```

## 🔴 Subtareas

### 🧱 DB
- PickingSession
- PickingItem

### ⚙️ Backend
- endpoints picking

### 🎨 Frontend
- interfaz picking

### 🔗 Integración
- sincronización inventario
```

---

# 🟡 US-I7 — Alertas de stock bajo

## 📌 Summary
Alertas de stock bajo

## 📝 Description

```text
## Descripción
Como administrador quiero recibir alertas de stock bajo para reaccionar antes de quedarme sin productos.

## UX / Interfaz

### Vista inventario
Mostrar:
- indicador de stock bajo
- productos con stock disponible menor al umbral
- enlace a lista de inventario filtrada

### Opciones
- establecer umbral de alerta
- recibir alertas en dashboard

---

## Reglas de negocio
- El umbral se calcula por producto/variante
- El sistema alerta cuando stock disponible <= umbral
- Las alertas deben actualizarse en tiempo real con los movimientos

---

## Criterios de aceptación
- Puedo ver productos con stock bajo
- Puedo establecer un umbral de alerta
- Las alertas se actualizan al registrar movimientos
- El sistema destaca productos críticos
```

## 🔴 Subtareas

### 🧱 DB
- tabla InventoryAlert (opcional)

### ⚙️ Backend
- GET /inventory/alerts
- lógica de umbral y alerta

### 🎨 Frontend
- panel de alertas
- filtro stock bajo

### 🔗 Integración
- notificaciones en dashboard

---

# 🟡 US-I8 — Ajustar inventario manualmente

## 📌 Summary
Ajustar inventario manualmente

## 📝 Description

```text
## Descripción
Como operador quiero ajustar el stock manualmente para corregir diferencias y errores de conteo.

## UX / Interfaz

### Modal ajuste
Campos:
- tienda
- variante
- cantidad ajustada
- tipo de ajuste
- motivo

### Tipos
- incremento
- decremento
- corrección

---

## Reglas de negocio
- El ajuste debe registrar motivo y usuario responsable
- No se permite cantidad negativa en stock total
- El stock disponible se recalcula automáticamente

---

## Criterios de aceptación
- Puedo ajustar stock manualmente
- El movimiento de ajuste queda registrado
- El inventario se actualiza correctamente
- No se permite ajuste a valores inválidos
```

## 🔴 Subtareas

### 🧱 DB
- tabla InventoryAdjustment

### ⚙️ Backend
- POST /inventory/adjustments
- persistir motivo y responsable

### 🎨 Frontend
- modal de ajuste
- validaciones

### 🔗 Integración
- actualizar inventario en tiempo real

---

# 🟡 US-I9 — Reportes y métricas de inventario

## 📌 Summary
Reportes de inventario

## 📝 Description

```text
## Descripción
Como gerente quiero consultar reportes de inventario para tomar decisiones basadas en métricas.

## UX / Interfaz

### Panel reportes
Mostrar:
- stock total por tienda
- movimientos por rango de fechas
- productos con stock crítico
- tendencias de consumo

### Acciones
- exportar a CSV
- filtrar por periodo
- descargar reporte

---

## Reglas de negocio
- Los reportes deben calcular stock actual y movimientos históricos
- Las cifras deben ser precisas y actualizadas
- El usuario puede exportar datos para análisis externos

---

## Criterios de aceptación
- Puedo ver reportes de inventario
- Puedo filtrar por fechas y tienda
- Puedo exportar informes
- El reporte muestra stock crítico y movimientos
```

## 🔴 Subtareas

### 🧱 DB
- vistas o consultas optimizadas para reportes

### ⚙️ Backend
- GET /inventory/reports
- exportar CSV/Excel

### 🎨 Frontend
- panel de métricas
- exportar reportes

### 🔗 Integración
- sincronizar datos con inventario actual


