import { useAuth0 } from "@auth0/auth0-react";
import { useOutletContext, useLocation } from "react-router-dom";
import { addToCart } from "../util/addToCart.js";

function AddToCartButton({ productId, amount = 1, buttonText = "+" }) {
  const { showNotification } = useOutletContext();

  const { pathname } = useLocation();
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } =
    useAuth0();
  const { changeCartCount } = useOutletContext();

  const handleAddToCart = async () => {
    let accessToken = "";
    if (isAuthenticated) {
      accessToken = await getAccessTokenSilently();
    } else {
      alert("Please log in to add items to the cart.");
      const searchParams = new URLSearchParams();
      searchParams.append("redirect", pathname);
      loginWithRedirect({
        authorizationParams: {
          redirect_uri:
            window.location.origin + "/login?" + searchParams.toString(),
        },
      });
      return;
    }

    try {
      const cartCount = await addToCart({
        productId,
        amount,
        accessToken,
      });
      changeCartCount(cartCount);
      showNotification("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Failed to add item to cart.");
    }
  };

  return (
    <>
      <button onClick={handleAddToCart}>{buttonText}</button>
    </>
  );
}

export default AddToCartButton;
