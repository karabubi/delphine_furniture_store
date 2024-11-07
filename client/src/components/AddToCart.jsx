import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { addToCart } from "../util/addToCart.js";
import Notification from "./Notification"; // Import the Notification component

function AddToCartButton({ productId, amount = 1, buttonText = "+" }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { changeCartCount } = useOutletContext();
  const [notification, setNotification] = useState("");

  const handleAddToCart = async () => {
    let accessToken = "";
    if (isAuthenticated) {
      accessToken = await getAccessTokenSilently();
    } else {
      setNotification("Please log in to add items to the cart.");
      navigate("/login", { state: { returnTo: "/products" } });
      return;
    }

    try {
      const cartCount = await addToCart({
        productId,
        amount,
        accessToken,
      });
      changeCartCount(cartCount);
      setNotification("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification("Failed to add item to cart.");
    }
  };

  return (
    <div>
      <button onClick={handleAddToCart}>{buttonText}</button>
      <Notification message={notification} show={!!notification} />
    </div>
  );
}

export default AddToCartButton;
