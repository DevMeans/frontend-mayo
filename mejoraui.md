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

### Página POS - Layout completo

**Estructura general: 3 zonas principales**

#### 1. Sidebar navegación izquierda (fijo, ~120px)
- Logo y nombre tienda (YourStore POS)
- Menú principal con iconos:
  - 📊 Venta (activa por defecto)
  - 📜 Historial
  - 👥 Clientes
  - 📦 Productos
  - 💵 Caja
  - 📈 Reportes
  - ⚙️ Ajustes
- Usuario logueado (Admin Vendedor)
- Botón de salida

#### 2. Área central - Catálogo de productos
- **Buscador superior**: "Buscar producto, SKU o código de barras..."
- **Filtros por categoría** (tabs):
  - Todos, Polos, Camisetas, Casacas, Pantalones, Accesorios, Más
  - Muestra cantidad de productos: "Mostrando 1 a 6 de 100 productos"
- **Grid responsivo** (3-4 columnas en desktop):
  - Card de producto con:
    - Imagen miniatura
    - Nombre del producto
    - Badge "Desde $/ 59.90"
    - Badge stock "Stock: 43"
    - Enlace o hover para abrir selector de variantes

#### 3. Panel lateral derecho - Carrito y opciones
- **Header**: "Carrito de venta (2)" con icono
- **Items en carrito**:
  - Cada item con: imagen pequeña, nombre, variante (color/talla), cantidad, precio
  - Botones: -/+ para cantidad, ✕ para eliminar
  - Subtotal por item
- **Resumen carrito**:
  - Subtotal: $/ 119.70
  - IGV (18%): $/ 21.55
  - **Total: $/ 141.25**
- **Botones principales**:
  - Botón azul grande: "Cobrar" (abre drawer de pago)
  - Botón gris: "Guardar venta" (sin cobrar)
  - Botón secundario: "Vaciar carrito"
- **Selector de tienda origen**: dropdown visible en carrito

### Drawers/Modales

#### 1. Selector de variantes (abre al click en producto)
- **Encabezado**: Nombre producto, SKU
- **Imagen grande** del producto
- **Sección Selección color**:
  - Título: "1. Selecciones color"
  - Círculos coloreados clickeables (Rojo, Azul, Verde, Negro)
  - Badge stock: "Stock: 5"
- **Sección Selección talla**:
  - Título: "2. Selecciona talla"
  - Botones: S, M, L, XL, XXL
  - Cada botón muestra stock disponible
  - Talla seleccionada se resalta
- **Cantidad**:
  - Stepper +/- cantidad
  - Campo numérico editable
- **Variante seleccionada**: resumen de lo elegido
- **Stock disponible**: "5 unidades"
- **Botón principal**: "Agregar al carrito" (azul)
- **Botón secundario**: "Cancelar"

#### 2. Drawer opciones de pago (abre al pulsar Cobrar)
- **Métodos de pago disponibles** (selección):
  - Efectivo
  - Tarjeta (crédito/débito)
  - Yape
  - Plin
  - Transferencia
  - Nequi
- **Monto a pagar**: Mostra el total
- **Vuelto**: Se calcula automáticamente si paga con efectivo
- **Botón principal**: "Confirmar pago" (azul)
- **Botón secundario**: "Cancelar"

### Validaciones y feedback

- ⚠️ Alerta si se intenta agregar sin stock disponible
- ✅ Confirmación visual (toast/snackbar) al agregar item al carrito
- ⏳ Indicador de carga durante creación de venta
- ✅ Mensaje de éxito con número de pedido al confirmar
- ❌ Mensaje de error con opción de reintentar si falla la transacción

---

## Flujo

1. **Cargar catálogo**: Sistema carga productos y variantes con stock disponible
2. **Buscar/filtrar**: Vendedor busca producto o filtra por categoría
3. **Seleccionar producto**: Click en card abre drawer de selector de variantes
4. **Elegir color**: Vendedor elige color (circles coloreados)
5. **Elegir talla**: Vendedor elige talla (se valida stock disponible por talla)
6. **Establecer cantidad**: Vendedor ajusta cantidad con stepper
7. **Agregar al carrito**: Click "Agregar al carrito" → item se muestra en panel lateral
8. **Repetir o cobrar**: Puede agregar más items o ir al paso 9
9. **Seleccionar pago**: Click "Cobrar" abre drawer con métodos de pago
10. **Elegir método**: Selecciona Efectivo, Tarjeta, Yape, Plin, Transferencia o Nequi
11. **Confirmar pago**: Click "Confirmar pago" crea la venta
12. **Éxito**: Muestra número de pedido, reinicia carrito
13. **Historial**: Venta aparece en historial de ventas

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

- Puedo ver el catálogo con todos los productos y variantes disponibles
- Puedo buscar productos por nombre, SKU o código de barras
- Puedo filtrar por categoría (Polos, Camisetas, Casacas, etc.)
- Puedo hacer click en un producto y abre drawer de selector de variantes
- Puedo seleccionar color, talla y cantidad en el drawer
- El drawer muestra stock disponible en tiempo real por talla
- Puedo agregar la variante seleccionada al carrito
- El carrito se actualiza y muestra item con precio, cantidad y subtotal
- El carrito calcula automáticamente subtotal, IGV (18%) y total
- Puedo modificar cantidad directamente en el carrito (+ / -)
- Puedo eliminar items del carrito
- Puedo vaciar el carrito con un click
- Al pulsar Cobrar, abre drawer con 6 métodos de pago (Efectivo, Tarjeta, Yape, Plin, Transferencia, Nequi)
- La venta se crea exitosamente y muestra número de pedido
- El stock reservado aumenta y se refleja correctamente en el inventario
- Puedo ver historial de ventas realizadas

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
- Sidebar de navegación POS con menú principal
- Página de catálogo con buscador y filtros por categoría
- Grid de productos con cards clickeables
- Drawer selector de variantes (color, talla, cantidad)
- Panel lateral carrito fijo con items, totales y botones
- Drawer de opciones de pago (6 métodos de pago)
- Toast/snackbar para confirmar agregados al carrito
- Validación de stock antes de agregar
- Cálculo automático de subtotal, impuesto (IGV 18%) y total
- Indicadores visuales de carga y éxito
- Manejo de errores con mensajes claros

### 🔗 Integración
- Consumir API de productos con filtros por categoría
- Obtener stock por variante y tienda
- Crear pedido con `POST /orders` incluyendo método de pago
- Actualizar stock visualmente en tiempo real
- Guardar preferencias de tienda seleccionada
- Validar disponibilidad antes de enviar cada item

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
