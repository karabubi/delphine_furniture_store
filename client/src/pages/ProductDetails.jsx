import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import AddToCartButton from "../components/AddToCart.jsx";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const [shouldReload, setShouldReload] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setShouldReload(true);
  }, [productId]);

  useEffect(() => {
    if (shouldReload) {
      fetch(`${API_URL}/products/${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch(console.error)
        .finally(() => {
          setShouldReload(false);
        });
    }
  }, [productId, shouldReload]);

  if (!product) {
    return <div>Loading...</div>;
  }
  function countDecrement() {
    if (count > 1) {
      setCount(count - 1);
    }
  }
  function countIncrement() {
    if (count < 20) {
      setCount(count + 1);
    }
  }
  function handleItemAdded() {
    setShouldReload(true);
  }
  return (
    <div className="product-details">
      <div className="product-details-image">
        <img src={`/${product.image}`} alt={product.image}></img>
      </div>
      <div className="details-container">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">Price: ${product.price}</p>
        <p className="info">Material: {product.material}</p>
        <p className="info">Size: {product.size}</p>
        <p className="info">Color: {product.color}</p>
        <p className="info">Available: {product.available}</p>
        <div className="buttons">
          <button onClick={() => countDecrement()}>-</button>
          <p>{count}</p>
          <button onClick={() => countIncrement()}>+</button>
          <AddToCartButton
            productId={product._id}
            amount={count}
            buttonText="Add to Cart"
            onItemAdded={handleItemAdded}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
