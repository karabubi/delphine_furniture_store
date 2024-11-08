import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import "./Cart.css";

const Cart = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } =
    useAuth0();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
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

    const fetchCartItems = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch("http://localhost:3000/cart", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(response);

        if (!response.ok) throw new Error("Failed to fetch cart items");

        const data = await response.json();
        setCartItems(data.products);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, getAccessTokenSilently, navigate, isDeleted]);

  function handleUpdateAmount(productId, amount) {
    console.log("handleUpdateAmount", productId, amount);

    setCartItems(
      cartItems.map((item) => {
        if (item.productId._id === productId) {
          return {
            ...item,
            amount,
          };
        } else {
          return item;
        }
      })
    );
  }

  const totalPrice = cartItems.reduce(
    (acc, cur) => acc + cur.amount * cur.productId.price,
    0
  );

  if (!isAuthenticated) {
    return null;
  }
  return (
    <>
      <div className="cart">
        <h2>Your Cart</h2>
        <div className="cart-item-container">
          {cartItems.length ? (
            cartItems.map((item) => (
              <CartItem
                key={item.productId._id}
                item={item}
                productId={item.productId._id}
                onUpdateAmount={handleUpdateAmount}
                setIsDeleted={setIsDeleted}
              />
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="price-total">
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>
        <div className="cart-total">
          <button>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </>
  );
};

export default Cart;
