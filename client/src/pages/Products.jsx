import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProductCard from "../components/ProductCard.jsx";
import "./Products.css";

import { useNavigate } from "react-router-dom";

import FilterBar from "../components/Filterbar.jsx";

function Products() {
  const [products, setProducts] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

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
        // console.log(filters);
        // Filter-Parameter in der URL erzeugen
        const query = new URLSearchParams(filters).toString(); // Dies erstellt die Filter-Query
        const url = query
          ? `http://localhost:3000/products?${query}`
          : `http://localhost:3000/products`; // Wenn keine Filter vorhanden, nur /products

        const response = await fetch(url, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        });

        // Überprüfen, ob die Antwort erfolgreich ist
        if (!response.ok) {
          throw new Error("Failed to fetch products: " + response.statusText);
        }

        const data = await response.json();

        // Überprüfen, ob die Antwort ein Array ist
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Expected an array but got:", data);
          setProducts([]); // Leere Liste setzen, wenn die Antwort nicht wie erwartet ist
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

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
        ); // API für Materialien
        const materials = await response.json();
        setAvailableMaterials(materials); // Setze die verfügbaren Materialien
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    }

    fetchMaterials();
    fetchProducts();
    fetchColors();
  }, [isAuthenticated, getAccessTokenSilently, filters]); // Füge filters als Abhängigkeit hinzu

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
      {/* <Notification show={true} message={"You need to login"}></Notification> */}
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
