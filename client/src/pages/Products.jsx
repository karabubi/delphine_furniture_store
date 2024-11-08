import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProductCard from "../components/ProductCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { useOutletContext } from "react-router-dom";
import "./Products.css";

function Products() {
  const { showNotification } = useOutletContext();
  const [products, setProducts] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    material: "",
    minPrice: "",
    maxPrice: "",
  });
  const [availableColors, setAvailableColors] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let accessToken = "";
        if (isAuthenticated) {
          accessToken = await getAccessTokenSilently();
        }
        const query = new URLSearchParams(filters).toString();
        const url = query
          ? `http://localhost:3000/products?${query}`
          : `http://localhost:3000/products`;

        const response = await fetch(url, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products: " + response.statusText);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          showNotification(""); // Reset notification if products are found
        } else {
          setProducts([]);
          showNotification("No products found for the selected filter.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        showNotification("Failed to fetch products. Please try again later.");
      }
    }

    fetchProducts();
  }, [isAuthenticated, getAccessTokenSilently, filters]);

  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await fetch("http://localhost:3000/products/colors");
        const colors = await response.json();
        setAvailableColors(colors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    }

    async function fetchMaterials() {
      try {
        const response = await fetch(
          "http://localhost:3000/products/materials"
        );
        const materials = await response.json();
        setAvailableMaterials(materials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    }

    fetchColors();
    fetchMaterials();
  }, []);

  const getHeadingText = () => {
    if (
      filters.category ||
      filters.color ||
      filters.material ||
      filters.minPrice ||
      filters.maxPrice
    ) {
      let heading = "";

      if (filters.category) {
        heading += `    Category: ${filters.category}`;
      }
      if (filters.color) {
        heading += `    Color: ${filters.color}`;
      }
      if (filters.material) {
        heading += `    Material: ${filters.material}`;
      }
      if (filters.minPrice || filters.maxPrice) {
        heading += `    Price: ${
          filters.minPrice ? `From ${filters.minPrice}` : ""
        } ${filters.maxPrice ? `To ${filters.maxPrice}` : ""}`;
      }

      return heading;
    }
    return "All Furniture";
  };

  return (
    <div>
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableColors={availableColors}
        availableMaterials={availableMaterials}
      />
      <h1 className="dynamic-h1-filter">{getHeadingText()}</h1>
      <div className="products-container">
        {products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
