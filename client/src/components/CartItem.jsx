import "./CartItem.css";
import { useOutletContext } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const CartItem = ({
  item,
  productId,
  onUpdateAmount,

  setIsDeleted,
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { changeCartCount } = useOutletContext();

  async function editCart(newAmount) {
    let accessToken = "";
    if (isAuthenticated) {
      accessToken = await getAccessTokenSilently();
    }
    try {
      const response = await fetch("http://localhost:3000/cart/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
        body: JSON.stringify({
          _id: productId,
          amount: newAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Data fetching error");
      }

      const data = await response.json();
      changeCartCount(data.cartCount);
      onUpdateAmount(productId, newAmount);
      console.log(data);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }
  const handleDelete = async (productId) => {
    let accessToken = "";
    console.log("test");
    if (isAuthenticated) {
      accessToken = await getAccessTokenSilently();
    }
    try {
      const response = await fetch("http://localhost:3000/cart/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
        body: JSON.stringify({
          _id: productId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Data fetching error");
      }
      setIsDeleted(false);
      changeCartCount(data.cartCount);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="cart-item">
      <div className="item-info">
        <div className="image-section">
          <img src={item.productId.image} alt={item.productId.name} />
        </div>
        <div className="info-section">
          <div className="info-container">
            <h3>{item.productId.name}</h3>
            {/* <p className="price-section">Price: ${item.productId.price}</p> */}
            <div className="total">
              <p>Total: ${(item.amount * item.productId.price).toFixed(2)}</p>
            </div>{" "}
            <div className="quantity">
              <button onClick={() => editCart(item.amount - 1)}>-</button>
              <span>{item.amount}</span>
              <button onClick={() => editCart(item.amount + 1)}>+</button>
            </div>{" "}
          </div>
          <button
            className="delete"
            onClick={() => {
              handleDelete(item.productId._id);
              setIsDeleted(true);
            }}
          >
            DELETE
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
