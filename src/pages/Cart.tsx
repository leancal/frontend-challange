import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { products as allProducts } from '../data/products'

const clp = (n:number)=> new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n)

export default function CartPage(){
  const { items, remove, clear, subtotal } = useCart()

  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const bestUnitPrice = (product: any, qty: number) => {
    if (!product) return 0
    if (!product.priceBreaks || product.priceBreaks.length === 0) return product.basePrice
    const applicable = product.priceBreaks.filter((pb: any) => qty >= pb.minQty)
    if (applicable.length === 0) return product.basePrice
    return applicable.reduce((min: number, pb: any) => Math.min(min, pb.price), Infinity)
  }

   const lines = items.map(it => {
    const p = allProducts.find(pr => pr.id === it.id)
    const unit = bestUnitPrice(p, it.qty)
    const total = unit * it.qty
    return { id: it.id, name: it.name, sku: p?.sku, supplier: p?.supplier, qty: it.qty, unit, total }
  })
  const total = lines.reduce((a,b)=> a + b.total, 0)

  const exportQuote = () => {
    const data = {
      company, contact, email, notes,
      items: lines,
      total,
      generatedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cotizacion-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container" style={{padding:'24px 0'}}>
      <h1 className="h2">Carrito</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="p1">Tu carrito está vacío.</p>
          <Link className="btn btn-primary cta1" to="/">Ir al catálogo</Link>
        </div>
      ) : (
        <>
          <ul style={{listStyle:'none', padding:0, margin:'16px 0'}}>
            {lines.map(line=>(
              <li key={line.id} style={{display:'grid', gridTemplateColumns:'1fr auto auto auto', gap:12, alignItems:'center', padding:'8px 0', borderBottom:'1px solid #eee'}}>
                <div>
                  <div className="p1-medium">{line.name}</div>
                  <div className="l1">{line.qty} × {clp(line.unit)} {line.sku ? `· ${line.sku}` : ''}</div>
                </div>
                <div className="l1">{line.supplier}</div>
                <div className="p1-medium">{clp(line.total)}</div>
                <button className="btn btn-tertiary l1" onClick={()=> remove(line.id)}>Quitar</button>
              </li>
            ))}
          </ul>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
            <div className="h3">Total: {clp(subtotal)}</div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-tertiary l1" onClick={clear}>Vaciar</button>
              <button className="btn btn-primary cta1" onClick={()=> alert('Simulador de cotización pendiente')}>Continuar a cotización</button>
            </div>
          </div>

          <div style={{marginTop:24, padding:'16px', border:'1px solid #eee', borderRadius:8, background:'#fafafa'}}>
            <h2 className="h3" style={{marginBottom:12}}>Simulador de Cotización</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <input className="p1" placeholder="Empresa" value={company} onChange={(e)=>setCompany(e.target.value)} />
              <input className="p1" placeholder="Contacto" value={contact} onChange={(e)=>setContact(e.target.value)} />
              <input className="p1" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input className="p1" placeholder="Notas" value={notes} onChange={(e)=>setNotes(e.target.value)} />
            </div>

            <div style={{display:'flex', gap:8, marginTop:12}}>
              <button className="btn btn-primary cta1" onClick={exportQuote}>
                <span className="material-icons">download</span>
                Exportar cotización (JSON)
              </button>
              <button className="btn btn-secondary cta1" onClick={()=> window.print()}>
                <span className="material-icons">print</span>
                Imprimir
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
