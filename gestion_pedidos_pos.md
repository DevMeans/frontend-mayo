# 🟦 ÉPICA — Gestión de pedidos y punto de venta (POS)

## 🎯 Objetivo

Permitir registrar pedidos desde punto de venta o ecommerce, controlar reservas de stock, gestionar preparación de pedidos (picking), sugerencias multitienda, responsables operativos y estados logísticos completos del pedido.

El sistema debe permitir conocer:

- qué pedido está pendiente
- qué pedido se está preparando
- qué productos ya fueron separados físicamente
- qué stock está reservado
- desde qué tienda se atenderá el pedido
- quién tiene responsabilidad del pedido
- qué pedido ya fue entregado
- trazabilidad completa del flujo operativo

---

# 🧠 FLUJO OPERATIVO COMPLETO

Pedido
↓
Validar stock local
↓
Buscar stock otras tiendas
↓
Reservar stock
↓
Transferencia interna (si aplica)
↓
Picking
↓
Pedido READY
↓
Entrega
↓
Descuento inventario definitivo

---

# 🟡 US-ORD1 — Crear pedido desde POS

## 📌 Summary

Crear pedido desde punto de venta

---

## 📝 Description

### Descripción

Como vendedor quiero crear pedidos desde el POS para registrar ventas y generar flujo operativo completo.

---

## UX / Interfaz

### Página POS

Layout dividido:

- búsqueda productos
- carrito lateral
- resumen pedido

---

## Flujo

1. Buscar producto
2. Seleccionar variante
3. Validar stock
4. Agregar al carrito
5. Confirmar pedido
6. Generar reserva automática

---

## Información producto

Mostrar:

- imagen
- nombre
- color
- talla
- precio
- stock disponible
- stock reservado

---

## Reglas de negocio

- No permitir agregar stock insuficiente
- El carrito debe actualizar subtotales
- El pedido inicia en estado PENDING
- El pedido debe generar reserva automática
- El stock reservado reduce disponibilidad de venta

---

## Criterios de aceptación

- Puedo buscar productos
- Puedo agregar variantes
- Puedo modificar cantidades
- El sistema valida stock disponible
- El pedido queda registrado
- El stock reservado aumenta

---

## 🔴 Subtareas

### 🧱 DB
- Crear Order
- Crear OrderItem
- Crear enums estados pedido

### ⚙️ Backend
- POST /orders
- Validar stock
- Crear reservas

### 🎨 Frontend
- Página POS
- Carrito dinámico
- Buscador productos

### 🔗 Integración
- Consumir API
- Actualizar stock visualmente

---

# 🟡 US-ORD2 — Gestionar estados del pedido

## 📌 Summary

Actualizar estado pedido

---

## 📝 Description

### Estados

- PENDING
- CONFIRMED
- WAITING_TRANSFER
- PREPARING
- READY
- DELIVERED
- CANCELLED
- WAITING_STOCK

---

## Reglas de negocio

- El pedido inicia en PENDING
- WAITING_STOCK indica falta de stock
- WAITING_TRANSFER indica transferencia pendiente
- CANCELLED libera reservas
- DELIVERED descuenta stock definitivo

---

## Criterios de aceptación

- Puedo cambiar estados
- El sistema registra historial
- El flujo respeta validaciones

---

## 🔴 Subtareas

### 🧱 DB
- Enum OrderStatus

### ⚙️ Backend
- PATCH /orders/:id/status

### 🎨 Frontend
- Selector estados
- Badges estados

### 🔗 Integración
- Actualización tiempo real

---

# 🟡 US-ORD3 — Reservar stock automáticamente

## 📌 Summary

Reserva automática de stock

---

## 📝 Description

### Descripción

Como sistema quiero reservar stock automáticamente para evitar sobreventa.

---

## Fórmula

availableStock = stock - reservedStock

---

## Reglas de negocio

- No reservar stock insuficiente
- Cancelar pedido libera reserva
- Entregar pedido consume reserva

---

## Criterios de aceptación

- El stock reservado aumenta
- El disponible disminuye
- Cancelar libera reserva

---

## 🔴 Subtareas

### 🧱 DB
- Tabla Reservation

### ⚙️ Backend
- lógica reserve/unreserve

### 🎨 Frontend
- mostrar reservado/disponible

### 🔗 Integración
- sincronización stock

---

# 🟡 US-ORD4 — Gestión de picking

## 📌 Summary

Preparar pedidos

---

## 📝 Description

### Descripción

Como picker quiero preparar pedidos para registrar avance logístico.

---

## Flujo

1. Tomar pedido
2. Separar productos
3. Confirmar productos preparados
4. Completar picking

---

## Estados

- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELLED

---

## Reglas de negocio

- Solo pedidos CONFIRMED pueden prepararse
- El picker registra avance
- COMPLETED marca pedido READY

---

## Criterios de aceptación

- Puedo tomar pedidos
- Puedo completar picking
- El pedido cambia automáticamente

---

## 🔴 Subtareas

### 🧱 DB
- PickingSession
- PickingItem

### ⚙️ Backend
- endpoints picking
- asignación responsable

### 🎨 Frontend
- tablero picking
- progreso preparación

### 🔗 Integración
- actualizar pedido automáticamente

---

# 🟡 US-ORD5 — Visualizar pedidos operativos

## 📌 Summary

Visualizar pedidos y estados

---

## 📝 Description

### Página

/orders

---

## Tabla

Mostrar:

- código
- cliente
- estado
- responsable
- progreso
- tienda origen
- tienda fulfillment

---

## Filtros

- estado
- responsable
- tienda
- fecha

---

## Criterios de aceptación

- Puedo visualizar pedidos
- Puedo abrir detalle
- Puedo visualizar progreso

---

## 🔴 Subtareas

### ⚙️ Backend
- GET /orders

### 🎨 Frontend
- tabla pedidos
- badges estados
- filtros

### 🔗 Integración
- actualización dinámica

---

# 🟡 US-ORD6 — Responsabilidad operativa

## 📌 Summary

Asignar responsables

---

## 📝 Description

### Responsables

- vendedor
- picker
- despachador

---

## Reglas de negocio

- El sistema registra responsables
- El historial guarda cambios

---

## Criterios de aceptación

- Puedo visualizar responsables
- Puedo reasignar responsables

---

## 🔴 Subtareas

### 🧱 DB
- relaciones usuario/pedido

### ⚙️ Backend
- asignación responsables

### 🎨 Frontend
- badges responsables

### 🔗 Integración
- sincronización pedido

---

# 🟡 US-ORD7 — Entregar pedido

## 📌 Summary

Completar entrega pedido

---

## 📝 Description

### Flujo

Pedido READY
→ entregar
→ DELIVERED

---

## Reglas de negocio

- DELIVERED consume reserva
- Genera movimiento OUT

---

## Criterios de aceptación

- Puedo entregar pedidos
- El inventario se actualiza

---

## 🔴 Subtareas

### ⚙️ Backend
- lógica entrega
- consumo reservas

### 🎨 Frontend
- botón entregar
- confirmación

### 🔗 Integración
- sincronizar inventario

---

# 🟡 US-ORD8 — Visualizar productos preparados del pedido

## 📌 Summary

Visualizar avance de picking

---

## 📝 Description

### Tabla detalle pedido

| Producto | Reservado | Picked | Estado |

---

## Estados item

- PENDING
- PARTIAL
- PICKED

---

## Reglas de negocio

- Picked no puede superar reservado
- El sistema calcula progreso

---

## Criterios de aceptación

- Puedo visualizar productos preparados
- Puedo visualizar pendientes

---

## 🔴 Subtareas

### 🧱 DB
- agregar pickedQuantity
- estados picking item

---

# ⚠️ Qué falta implementar

## Backend
- Endpoints de picking no están definidos en `backend/src/presentation/order/router.ts` ni en `backend/src/presentation/order/controller.ts`.
- El `UpdateOrderPickingDto` se importa pero no se utiliza, lo que indica que no hay flujo de picking completo.
- No existe un endpoint específico para entregar pedidos aparte de `PATCH /api/orders/:id/status`.
- No hay trazabilidad de historial de cambios de estado/operaciones en pedido.
- La reserva remota está disponible, pero falta una UI/endpoint de selección de tienda remota y seguimiento de transferencias asociadas al pedido.

## Frontend
- El POS carga productos, pero no carga stock real ni stock reservado por variante/tienda.
- No se invoca `getRemoteStock` ni `reserveRemoteStock` desde la interfaz.
- El vendedor `sellerUserId` está hardcodeado como `1` en `pos.component.ts`.
- Falta vista de detalle de pedido con reservas, picking, transferencias y estado de cada item.
- Falta pantalla o componente de picking para registrar progreso de preparación de pedidos.
- Falta botón de entrega y confirmación de pedido en la interfaz de gestión.
- Falta manejo de errores de stock insuficiente antes de agregar al carrito, porque `availableStock` no se inicializa correctamente.


### ⚙️ Backend
- cálculo progreso
- endpoints detalle

### 🎨 Frontend
- barra progreso
- detalle picking

### 🔗 Integración
- sincronización tiempo real

---

# 🟡 US-ORD9 — Sugerir stock en otras tiendas

## 📌 Summary

Sugerir stock multitienda

---

## 📝 Description

### Descripción

Como vendedor quiero visualizar stock en otras tiendas para continuar ventas aunque mi tienda no tenga disponibilidad.

---

## Flujo

Stock local = 0
→ buscar otras tiendas

---

## Mostrar

- tienda
- stock disponible
- tipo ubicación

---

## Acciones

- reservar desde tienda
- generar transferencia

---

## Reglas de negocio

- Solo mostrar stock disponible real
- Excluir stock reservado
- No permitir sobreventa

---

## Criterios de aceptación

- Puedo visualizar otras tiendas
- Puedo seleccionar tienda origen
- El stock remoto queda reservado

---

## 🔴 Subtareas

### ⚙️ Backend
- búsqueda stock global
- cálculo disponible real

### 🎨 Frontend
- modal sugerencias stock
- selector tienda origen

### 🔗 Integración
- sincronización stock multitienda

---

# 🟡 US-ORD10 — Reservar stock remoto

## 📌 Summary

Reservar stock desde otra tienda

---

## 📝 Description

### Flujo

Pedido
→ reserva remota
→ transferencia interna

---

## Reglas de negocio

- La reserva afecta tienda origen
- El stock disponible disminuye
- El pedido registra fulfillmentStoreId

---

## Criterios de aceptación

- El stock remoto queda separado
- El pedido conoce tienda origen

---

## 🔴 Subtareas

### 🧱 DB
- sourceStoreId
- fulfillmentStoreId

### ⚙️ Backend
- reserve remote stock

### 🎨 Frontend
- resumen fulfillment

### 🔗 Integración
- sincronización reservas

---

# 🟡 US-ORD11 — Generar transferencia automática por pedido

## 📌 Summary

Transferencia automática desde otra tienda

---

## 📝 Description

### Descripción

Como sistema quiero generar transferencias internas automáticamente para abastecer pedidos desde otras tiendas.

---

## Flujo

Pedido
→ seleccionar tienda origen
→ crear transferencia
→ estado IN_TRANSIT

---

## Reglas de negocio

- La transferencia queda ligada al pedido
- El origen descuenta stock disponible
- El destino recibe stock al completar transferencia

---

## Estados transferencia

- PENDING
- PICKING
- IN_TRANSIT
- RECEIVED
- CANCELLED

---

## Criterios de aceptación

- Se genera transferencia automática
- El pedido mantiene trazabilidad
- El stock tránsito queda registrado

---

## 🔴 Subtareas

### 🧱 DB
- Transfer
- TransferItem
- relación Order

### ⚙️ Backend
- generación automática transferencias
- recepción transferencia

### 🎨 Frontend
- tracking transferencia
- timeline estados

### 🔗 Integración
- sincronización pedido/inventario

---

# 🧠 CONCEPTOS IMPORTANTES

## Reserva

Separación lógica del stock

---

## Picking

Separación física del producto

---

## Transferencia

Movimiento entre ubicaciones

---

## Fulfillment Store

Tienda desde donde se atenderá el pedido

---

# 🧠 STOCK

## Tipos

- stock físico
- reservado
- disponible
- tránsito

---

## Fórmula

disponible = stock - reservado

---

# 🧠 RESULTADO FINAL

El sistema debe sentirse como:

- ERP operativo
- OMS (Order Management System)
- POS moderno
- centro logístico multitienda
- fulfillment distribuido
- trazabilidad completa
- logística real de retail moderno

---

# 🔗 Documentación backend

- La implementación backend asociada se documenta en `backend/gestion_pedidos_pos.md`.
- Incluye rutas, DTOs, validaciones y flujo de stock/reservas.
- Revisa los endpoints de pedido para integrar correctamente el frontend.

