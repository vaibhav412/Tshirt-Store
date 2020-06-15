// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
// eslint-disable-next-line
import { cartEmpty, loadCart } from "./helper/cartHelper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
// eslint-disable-next-line
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = f => f,
  reload = undefined
}) => {
  // eslint-disable-next-line
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: ""
  });
  // eslint-disable-next-line
  const token = isAutheticated() && isAutheticated().token;
  // eslint-disable-next-line
  const userId = isAutheticated() && isAutheticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.map(p => {
      amount = amount + p.price;
      return amount
    });
    return amount;
  };

  const makePayment = token => {
    const body = {
      userId,
      token,
      products
    };
    const headers = {
      "Content-Type": "application/json"
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
      .then(response => {
        console.log(response);
        const { status } = response;
        console.log("STATUS ", status);
        const orderData = {
          products: products
        };
        createOrder(userId, token, orderData);
        cartEmpty(() => {
          console.log("Cart Emptied");
        });

        setReload(!reload);
      })
      .catch(error => console.log(error));
  };

  const showStripeButton = () => {
    return isAutheticated() && (
      <StripeCheckoutButton
        stripeKey="PUBLISHABLE_KEY"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
      >
        {products.length > 0 ?

          <button className="btn btn-block btn-success">Buy</button>
          : (
            <h3>Please add something to cart</h3>
          )}
      </StripeCheckoutButton>
    )
  };

  return (
    <div>
      <h2 className="mt-5">Payment Gateway #2</h2>
      <h3 className="text-white">Your bill is {getFinalAmount()} $</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;