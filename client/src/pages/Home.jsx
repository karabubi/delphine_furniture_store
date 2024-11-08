import "./Home.css";
import { Link } from "react-router-dom";
// import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AddToCartButton from "../components/AddToCart.jsx";

function Home() {
  const [products, setProducts] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchBestSelling() {
      try {
        let accessToken = "";
        if (isAuthenticated) {
          accessToken = await getAccessTokenSilently();
        }
        const response = await fetch(`${API_URL}/products/bestSelling`, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        });

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchBestSelling();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <>
      <div className="home-content">
        <div className="home-header">
          <h1>Make Your Interior More Minimalistic & Modern</h1>
          <p>
            Turn your room with panto into a lot more minimalist and modern with
            ease and speed
          </p>
        </div>

        <section className="best-selling">
          <h2>Best Selling Products</h2>
          <div className="product-cards">
            {products.map((product) => (
              <div className="card" key={product._id}>
                <Link to={`/products/${product._id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <h4>{product.categoryId?.name || "N/A"}</h4>
                <h3>{product.name}</h3>
                {/* <div> */}
                <p>
                  <span>${product.price}</span>

                  <AddToCartButton productId={product._id} />

                  {/* </div> */}
                </p>
              </div>
            ))}
          </div>

          <Link to="/products" className="view-all">
            View All →
          </Link>
        </section>

        <section className="subscription">
          <h2>Subscribe to get the latest news about us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore.
          </p>
          {/* <div className="qr-code">
            <img src="../../public/qr-code.png" alt="QR Code" />
          </div> */}
        </section>
      </div>
    </>
  );
}

export default Home;
