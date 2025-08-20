# SWAG Frontend Challenge — Solución

Catálogo de productos hecho con **React + TypeScript + Vite** y **CSS Modules**.  
Se priorizó **corregir bugs** primero y luego completar las **funcionalidades** solicitadas.

---

## 🚀 Demo y repositorio

- **Repositorio (fork con mi solución):** `https://github.com/leancal/frontend-challange`
- **Demo (Vercel/Netlify, opcional):** `https://frontend-challange-alpha.vercel.app/`

## ▶️ Cómo correr el proyecto

```bash
npm install
npm run dev
# abrir http://localhost:3000
```

Build + preview:

```bash
npm run build
npm run preview
# abre el link que imprime Vite
```

---

## ✅ Qué se entregó

### Parte 1 — Bugs (8/8)

- **Búsqueda**: ahora es insensible a mayúsculas y acentos (normalización `NFD`).
- **Ordenamiento por precio**: opción “Precio” ordena por `basePrice` ascendente.
- **Estado**: `pending` ya no aparece como “Disponible” (badge **Pendiente** y botón **Agregar** deshabilitado).
- **Stock**: datos consistentes (incluye el producto esperado con stock correcto).
- **Datos**: catálogo completo con **20** productos.
- **Cálculo**: la calculadora elige el **mejor precio por volumen** aplicable (unitario más bajo según `minQty`).
- **Formato**: precios en **CLP** con `Intl.NumberFormat('es-CL', { currency: 'CLP' })`.
- **Validación**: la cantidad se limita a `1…stock` (y se “clamp-ea” en UI).

### Parte 2 — Funcionalidades (completas)

**Carrito**
- Agregar desde **card** y desde **calculadora** ✅  
- **Contador** en el Header ✅  
- **Persistencia** en `localStorage` ✅  
- Página **/cart** con lista, quitar, vaciar y total ✅

**Filtros avanzados**
- Filtro por **proveedor** ✅  
- Filtro por **rango de precios** ✅  
- Botón **Limpiar filtros** ✅

**Simulador de cotización**
- Formulario con **empresa**, **contacto**, **email**, **notas** (en `/cart`) ✅  
- Recalcula precio final con **descuentos por volumen** por ítem ✅  
- **Exportar JSON** del resumen + **Imprimir** ✅

### UX extra

- **Loading state** breve en el listado ✅  
- **Modal de cotización** desde las cards (sin salir del catálogo) ✅  
- **Toast** simple “Agregado al carrito” ✅  
- Pequeñas transiciones/hover y respeto a `prefers-reduced-motion` ✅  
- Mensajes de vacío “No hay productos” ✅

---

## 🧠 Decisiones y trade-offs

- Mantener **estructura original** y **CSS Modules** sin librerías pesadas.
- “Precio” ordena **ascendente** (se puede extender a desc si hace falta).
- El export es **JSON** (rápido de implementar). Se agregó también **Imprimir**.
- Validaciones del form de cotización son básicas (pueden endurecerse con `required`/regex).

---

## 🗂️ Estructura y cambios relevantes

- `src/context/CartContext.tsx` – Contexto de carrito (items, add/remove/clear, subtotal, count).
- `src/hooks/useLocalStorage.ts` – Persistencia simple en `localStorage`.
- `src/pages/Cart.tsx` – Carrito + simulador de cotización + export/print.
- `src/components/Header.tsx` – Badge con contador real.
- `src/components/ProductCard.tsx` – Estado `pending`, CLP, botón **Agregar**, botón **Cotizar** (modal).
- `src/components/ProductFilters.tsx` – Proveedor, rango de precios, limpiar.
- `src/pages/ProductList.tsx` – Búsqueda normalizada, sort por precio, loading, **modal**.
- `src/components/PricingCalculator.tsx` – Mejor tier, validación por stock, CLP, `autoFocus`.
- `src/components/Modal.tsx` + `Modal.css` – Modal accesible (ESC, click afuera, lock scroll).
- `src/components/Toast.tsx` + `Toast.css` – Toast simple para feedback.

---

## 🔎 Cómo probar (checklist)

- Buscar **“tazá”** o **“TAZA”** → encuentra *Taza Térmica Smart 350ml*.
- Orden **Precio** → lista ascendente por `basePrice`.
- Card con **Pendiente** → badge “Pendiente” y botón **Agregar** deshabilitado.
- En detalle o modal: subir cantidad sobre cada `minQty` → baja el **unitario** y el **total** usa el **mejor** tier.
- Cantidad no supera el **stock**.
- Agregar ítems → **contador** en Header sube y persiste tras recargar.
- Filtros: proveedor + rango + limpiar → se actualiza el grid y el contador de productos.
- `/cart`: quitar/vaciar, ver total, **exportar JSON** e **imprimir**.

---

## 📦 Envío (lo que pide el formulario)

1. **URL de tu repositorio GitHub:** `<https://github.com/<tu-usuario>/<tu-repo>>`  
2. **URL del Demo (opcional):** `<https://<tu-app>.vercel.app>`  
3. **Nombre completo:** `Leandro Calvet`  
4. **Email:** `leandrocalvet14@gmail.com`

---

## 🗺️ Siguientes mejoras (si hubiera tiempo)

- Orden **Precio desc** y **Nombre Z-A**.
- Paginación client-side.
- Guardar filtros en **URL params**.
- Validación de formulario (required, patrón de email).
- Más accesibilidad (roles, labels, foco visible en todos los CTA).
- Tests unitarios de utilidades (búsqueda, pricing).

---

> Gracias por revisar 🙌  
> _Autor:_ `Leandro Calvet` · ✉️ `leandrocalvet14@gmail.com`
