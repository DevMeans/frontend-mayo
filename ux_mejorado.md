# Inventory UX Refactor — Contexto para implementación

## Objetivo

Refactorizar la pantalla de inventario para convertirla en una experiencia moderna tipo ERP/SaaS.

La pantalla actual tiene demasiados formularios visibles y genera ruido visual.

El nuevo enfoque debe estar centrado en:

* visualización rápida de stock
* acciones contextuales desde la tabla
* drawer lateral responsive
* separación entre visualización y acción

---

# Nuevo flujo UX

## La página principal de inventario NO debe contener formularios fijos.

Eliminar completamente:

* formulario de registrar movimiento
* selects permanentes
* formulario inline

La página debe enfocarse únicamente en:

* búsqueda
* filtros
* tabla de inventario
* acciones rápidas

---

# Nueva estructura

## Ruta

```text
/inventory
```

---

# Layout principal

## Header

Título:

```text
Inventario
```

Acciones opcionales:

* Ver movimientos
* Transferencias

---

# Barra de búsqueda principal

```text
Buscar producto o SKU
```

La búsqueda debe permitir:

* SKU
* nombre producto
* color
* talla

---

# Filtros secundarios

Los filtros avanzados deben estar colapsados.

Ejemplo:

```text
Filtros avanzados ▼
```

Dentro:

* tienda
* color
* talla
* incluir stock 0
* solo reservados

---

# Tabla principal

La tabla debe ser el centro operativo de la pantalla.

Columnas recomendadas:

| Producto | Variante | Tienda | Disponible | Reservado | Acciones |

Opcionalmente:

* SKU secundario
* badges visuales

---

# Acciones contextuales

Cada fila debe tener un menú de acciones.

Ejemplo:

```text
⋮
```

Opciones:

* Ingreso
* Salida
* Ajuste
* Transferir
* Ver historial

---

# Comportamiento importante

NO usar formularios inline.

Las acciones deben abrir:

* drawer lateral
  o
* bottom sheet responsive en mobile

---

# Drawer lateral

## Desktop

Abrir desde la derecha.

Ancho recomendado:

```text
420px
```

---

## Mobile

Debe adaptarse como:

* bottom sheet
  o
* fullscreen responsive

---

# Drawer — Registrar movimiento

## El drawer recibe contexto desde la fila seleccionada.

NO volver a pedir:

* variante
* tienda

Porque ya vienen desde la fila.

---

# Ejemplo visual

```text
Producto:
Polo rojo M

Tienda:
Principal

Tipo:
Ingreso

Cantidad:
[      ]

Nota:
[      ]

[ Guardar ]
```

---

# Tipos de movimiento

* ingreso
* salida
* ajuste

---

# Reglas UX importantes

## Inventario

La pantalla principal debe enfocarse en:

```text
VER STOCK
```

No en registrar movimientos.

---

## Acciones

Las acciones deben sentirse rápidas y contextuales.

El usuario debe:

```text
ver fila → actuar
```

No:

```text
llenar formulario → buscar variante
```

---

# Historial de movimientos

NO mostrar historial completo debajo de la tabla principal.

Opciones válidas:

* modal historial
* drawer historial
* página separada:
  /inventory/movements

---

# Responsive

La experiencia mobile es importante.

El drawer debe adaptarse correctamente:

* evitar modales pequeños
* evitar formularios largos inline
* evitar scroll excesivo

---

# Objetivo visual

La interfaz debe sentirse similar a:

* Shopify Admin
* Odoo moderno
* Linear
* Stripe Dashboard

Debe evitar apariencia de panel administrativo clásico.

---

# Resultado esperado

El módulo debe quedar:

* limpio
* rápido
* moderno
* contextual
* escalable
* mobile friendly
