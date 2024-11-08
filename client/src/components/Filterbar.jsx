
import "./FilterBar.css";
const FilterBar = ({
filters,
onFilterChange = [],
availableColors,
availableMaterials,
}) => {
const handleCategoryChange = (e) => {
  console.log("Selected Filters:", filters);
  onFilterChange({ ...filters, category: e.target.value });
};
const handleMinPriceChange = (e) => {
  onFilterChange({ ...filters, minPrice: e.target.value });
};
const handleMaxPriceChange = (e) => {
  onFilterChange({ ...filters, maxPrice: e.target.value });
};

const handleColorChange = (e) => {
  onFilterChange({ ...filters, color: e.target.value });
};

const handleMaterialChange = (e) => {
  // Material-Handler hinzufügen
  onFilterChange({ ...filters, material: e.target.value });
};

console.log("Colors:  ", availableColors);

return (
  <div className="filter-bar">
    <select
      value={filters.category}
      onChange={(e) => {
        // setCategory(e.target.value);
        handleCategoryChange(e);
      }}
    >
      <option value="">All Categories</option>
      <option value="Chair">Chairs</option>
      <option value="Table">Tables</option>
      <option value="Bookshelf">Bookshelves</option>
      <option value="Wardrobe">Wardrobes</option>
      <option value="Bed">Beds</option>
      <option value="Sofa">Sofas</option>
    </select>
    <input
      type="number"
      placeholder="Min Price"
      value={filters.minPrice || ""}
      onChange={handleMinPriceChange}
    />
    <input
      type="number"
      placeholder="Max Price"
      value={filters.maxPrice || ""}
      onChange={handleMaxPriceChange}
    />
    <select value={filters.color || ""} onChange={handleColorChange}>
      <option value="">All Colors</option>
      {availableColors.map((color) => (
        <option key={color} value={color}>
          {color}
        </option>
      ))}
    </select>
    <select value={filters.material || ""} onChange={handleMaterialChange}>
      {" "}
      {/* Material-Filter Dropdown */}
      <option value="">All Materials</option>
      {availableMaterials.map((material) => (
        <option key={material} value={material}>
          {material}
        </option>
      ))}
    </select>
  </div>
);
};




export default FilterBar;
