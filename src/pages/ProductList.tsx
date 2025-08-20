import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { products as allProducts } from '../data/products'
import { Product } from '../types/Product'
import './ProductList.css'
import Modal from '../components/Modal'
import PricingCalculator from '../components/PricingCalculator'

const norm = (s: string) =>
  s?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [loading, setLoading] = useState(false)
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null)

  // Filter and sort products based on criteria
  const filterProducts = (category: string, search: string, sort: string) => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...allProducts]

      // Category filter
      if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category)
      }

      if (selectedSupplier) {
        filtered = filtered.filter(p => p.supplier === selectedSupplier)
      }

      // Search filter
      const qn = norm(search)
      if (qn) {
        filtered = filtered.filter(p =>
          norm(p.name).includes(qn) || norm(p.sku).includes(qn)
        )
      }

      if (minPrice != null) filtered = filtered.filter(p => p.basePrice >= minPrice!)
      if (maxPrice != null) filtered = filtered.filter(p => p.basePrice <= maxPrice!)

      // Sorting logic
      switch (sort) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'price':
          filtered.sort((a, b) => a.basePrice - b.basePrice)
          break
        case 'stock':
          filtered.sort((a, b) => b.stock - a.stock)
          break
        default:
          break
      }

      setFilteredProducts(filtered)
      setLoading(false)
    }, 250)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(category, searchQuery, sortBy)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    filterProducts(selectedCategory, search, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterProducts(selectedCategory, searchQuery, sort)
  }

  const handleSupplierChange = (s: string) => {
    setSelectedSupplier(s)
    filterProducts(selectedCategory, searchQuery, sortBy)
  }
  const handleMinPrice = (n?: number) => {
    setMinPrice(n)
    filterProducts(selectedCategory, searchQuery, sortBy)
  }
  const handleMaxPrice = (n?: number) => {
    setMaxPrice(n)
    filterProducts(selectedCategory, searchQuery, sortBy)
  }
  const handleClear = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedSupplier('')
    setMinPrice(undefined)
    setMaxPrice(undefined)
    filterProducts('all', '', sortBy)
  }

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">{filteredProducts.length}</span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          selectedSupplier={selectedSupplier}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onSupplierChange={handleSupplierChange}
          onMinPriceChange={handleMinPrice}
          onMaxPriceChange={handleMaxPrice}
          onClearFilters={handleClear}
        />

        {/* Products Grid */}
        <div className="products-section">
          {loading ? (
            <div className="empty-state">
              <span className="material-icons spin">autorenew</span>
              <p className="p1">Cargando catálogo…</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button
                className="btn btn-primary cta1"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  filterProducts('all', '', sortBy)
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onQuote={setQuoteProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
      {quoteProduct && (
        <Modal title={`Cotizar: ${quoteProduct.name}`} onClose={() => setQuoteProduct(null)}>
          <PricingCalculator product={quoteProduct} autoFocus />
        </Modal>
      )}
    </div>
  )
}

export default ProductList