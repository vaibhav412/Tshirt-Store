import React, { useState, useEffect } from "react";
import { cartEmpty } from "./helper/cartHelper";
import { getmeToken, processPayment } from "./helper/paymentbhelper";
import { createOrder } from "./helper/orderHelper";
import { isAutheticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

const Paymentb = ({ products, setReload = f => f, reload = undefined }) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });

    const userId = isAutheticated() && isAutheticated().user._id;
    const token = isAutheticated() && isAutheticated().token;

    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
            if (info.error) {
                setInfo({ ...info, error: info.error });
            } else {
                const clientToken = info.clientToken;
                setInfo({ clientToken });
            }
        });
    };

    const showbtdropIn = () => {
        return (
            <div>
                {info.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={(instance) => (info.instance = instance)}
                        />
                        <button className="btn btn-block btn-success" onClick={onPurchase} >Buy</button>
                    </div>
                ) : (
                        <h3>Please add something to cart</h3>
                    )}
            </div>
        );
    };

    useEffect(() => {
        getToken(userId, token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPurchase = () => {
        setInfo({ loading: true });
        let nonce;
        info.instance.requestPaymentMethod().then(data => {
            nonce = data.nonce;
            const paymentData = {
                payment_method_nonce: nonce,
                amount: getAmount()
            };
            processPayment(userId, token, paymentData)
                .then(response => {
                    setInfo({ ...info, success: response.success, loading: false });
                    console.log("PAYMENT SUCCESS");
                    console.log("res", response);
                    const orderData = {
                        products: products,
                        transaction_id: response.transaction.id,
                        amount: response.transaction.amount
                    };
                    createOrder(userId, token, orderData);
                    cartEmpty(() => {
                        console.log("Cart Emptied");
                    });

                    setReload(!reload);
                })
                .catch(error => {
                    setInfo({ loading: false, success: false });
                    console.log("PAYMENT FAILED");
                });
        });
    };


    const getAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount + p.price;
            return amount;
        });
        return amount;
    };

    return (
        <div>
            <h2>Payment Gateway #1</h2>
            <h3>Your bill is {getAmount()} $</h3>
            {showbtdropIn()}
        </div>
    );
};

export default Paymentb;
