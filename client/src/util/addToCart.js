export async function addToCart({
  productId,
  amount = 1,
  accessToken,
  // isAuthenticated,
  // getAccessTokenSilently,
  // navigate,
  // setCartCount,
}) {
  try {
    // let accessToken = "";
    // if (isAuthenticated) {
    //   accessToken = await getAccessTokenSilently();
    // } else {
    //   alert(
    //     "Bitte loggen Sie sich ein, um Produkte in den Warenkorb zu legen."
    //   );
    //   navigate("/login", { state: { returnTo: "/products" } });
    //   return;
    // }

    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
      body: JSON.stringify({
        _id: productId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error("Data fetching error");
    }

    const { cartCount } = await response.json();
    return cartCount;
    // TODO: return cart or cart count
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}
