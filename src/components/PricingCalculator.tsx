import { useState, useEffect, useRef } from 'react'
import { Product } from '../types/Product'
import './PricingCalculator.css'
import { useCart } from '../context/CartContext'

interface PricingCalculatorProps {
  product: Product
  autoFocus?: boolean
}

const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const PricingCalculator = ({ product, autoFocus }: PricingCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedBreak, setSelectedBreak] = useState<number>(0)
  const { add } = useCart()
  const qtyRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { if (autoFocus) qtyRef.current?.focus() }, [autoFocus])

  const maxQty = Math.min(9999, product.stock || 0)

  const bestUnitPrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) return product.basePrice
    // filtrar escalas aplicables y elegir la de menor precio
    const applicable = product.priceBreaks.filter(pb => qty >= pb.minQty)
    if (applicable.length === 0) return product.basePrice
    return applicable.reduce((min, pb) => Math.min(min, pb.price), Infinity)
  }

  // Calculate best pricing for quantity
  const calculatePrice = (qty: number) => bestUnitPrice(qty) * qty

  // Calculate discount amount
  const getDiscount = (qty: number) => {
    const baseTotal = product.basePrice * qty
    const discountedTotal = calculatePrice(qty)
    if (baseTotal <= 0) return 0
    return ((baseTotal - discountedTotal) / baseTotal) * 100
  }

  // Format price display
  const formatPrice = (price: number) => clp(price)

  const safeQty = Math.max(1, Math.min(quantity || 1, maxQty))
  const currentPrice = calculatePrice(quantity)
  const discountPercent = getDiscount(quantity)

  return (
    <div id="cotizador" className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* Quantity Input */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <input
              type="number"
              ref={qtyRef}
              value={safeQty}
              onChange={(e) => {
                const v = parseInt(e.target.value || '1', 10)
                setQuantity(Math.max(1, Math.min(v, maxQty)))
              }}
              className="quantity-input p1"
              min={1}
              max={maxQty}
            />
            <span className="quantity-unit l1">unidades</span>
          </div>
          <small className="l1">Máximo disponible: {maxQty}</small>
        </div>

        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks.map((priceBreak, index) => {
                const isActive = quantity >= priceBreak.minQty
                const isSelected = selectedBreak === index

                return (
                  <div
                    key={index}
                    className={`price-break ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBreak(index)
                      setQuantity(priceBreak.minQty)
                    }}
                  >
                    <div className="break-quantity l1">
                      {priceBreak.minQty}+ unidades
                    </div>
                    <div className="break-price p1-medium">
                      {formatPrice(priceBreak.price)}
                    </div>
                    {priceBreak.discount != null && (
                      <div className="break-discount l1">
                        -{priceBreak.discount}%
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {formatPrice(calculatePrice(quantity) / quantity)}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{safeQty} unidades</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="calculator-actions">
          <button
            className="btn btn-secondary cta1"
            onClick={() => {
              // Handle quote request
              alert(`Cotización solicitada para ${safeQty} unidades de ${product.name}`)
            }}
          >
            <span className="material-icons">email</span>
            Solicitar cotización oficial
          </button>

          <button
            className="btn btn-primary cta1"
            onClick={() => {
              add({ id: product.id, name: product.name, price: bestUnitPrice(safeQty) }, safeQty)
              window.dispatchEvent(new CustomEvent('toast', { detail: { msg: 'Agregado al carrito' } }))
            }}
            disabled={product.status !== 'active' || product.stock <= 0}
          >
            <span className="material-icons">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="material-icons">local_shipping</span>
            <div className="info-content">
              <span className="info-title l1">Envío gratis</span>
              <span className="info-detail l1">En pedidos sobre {clp(50000)}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="material-icons">schedule</span>
            <div className="info-content">
              <span className="info-title l1">Tiempo de producción</span>
              <span className="info-detail l1">7-10 días hábiles</span>
            </div>
          </div>

          <div className="info-item">
            <span className="material-icons">verified</span>
            <div className="info-content">
              <span className="info-title l1">Garantía</span>
              <span className="info-detail l1">30 días de garantía</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingCalculator