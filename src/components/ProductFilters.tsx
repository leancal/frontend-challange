import { categories, suppliers } from '../data/products'
import './ProductFilters.css'

interface ProductFiltersProps {
  selectedCategory: string
  searchQuery: string
  sortBy: string
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  selectedSupplier?: string
  minPrice?: number
  maxPrice?: number
  onSupplierChange?: (supplier: string) => void
  onMinPriceChange?: (n?: number) => void
  onMaxPriceChange?: (n?: number) => void
  onClearFilters?: () => void
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  selectedSupplier = '',
  minPrice,
  maxPrice,
  onSupplierChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters
}: ProductFiltersProps) => {
  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedor</h3>
          <select
            className="sort-select p1"
            value={selectedSupplier}
            onChange={(e)=> onSupplierChange?.(e.target.value)}
          >
            <option value="">Todos</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {/* fin cambio */}

        {/* cambia: Rango de precios */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Precio</h3>
          <div className="range-row">
            <input
              type="number"
              className="sort-select p1"
              placeholder="Mín"
              value={minPrice ?? ''}
              onChange={(e)=> onMinPriceChange?.(e.target.value ? Number(e.target.value) : undefined)}
              min={0}
            />
            <span className="dash">—</span>
            <input
              type="number"
              className="sort-select p1"
              placeholder="Máx"
              value={maxPrice ?? ''}
              onChange={(e)=> onMaxPriceChange?.(e.target.value ? Number(e.target.value) : undefined)}
              min={0}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Quick Stats - Bug: hardcoded values instead of dynamic */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-list">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="supplier-item">
                <span className="supplier-name l1">{supplier.name}</span>
                <span className="supplier-count l1">{supplier.products}</span>
              </div>
            ))}
          </div>
        </div>

         <div className="filter-actions">
          <button className="btn btn-tertiary l1" onClick={()=> onClearFilters?.()}>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters