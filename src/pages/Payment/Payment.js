import React, { useContext, useState } from "react";
import "./Payment.css";
import LayOut from "../../LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };
  const handlePayment = async (e) => {
    e.preventDefault();

    // try {
    //   setProcessing(true);
    //   // 1 backend || fucctions ---> ccontact to cliant secret
    //   const response = await axiosInstance({
    //     method: "POST",
    //     url: `/payment/create?total=${total * 100}`,
    //   });
    //   // console.log(response.data);
    //   const clientSecret = response.data?.clientSecret;
    //   // 2. cliant side (react side confirmation)
    //   const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    //     payment_method: {
    //       card: elements.getElement(CardElement),
    //     },
    //   });
    //   // console.log(paymentIntent)
    //   // 3. after confirmation --> order firestore database BiSave,clear basket
    //   await db
    //     .collection("users")
    //     .doc(user.uid)
    //     .collection("orders")
    //     .doc(paymentIntent.id)
    //     .set({
    //       basket: basket,
    //       amount: paymentIntent.amount,
    //       created: paymentIntent.created,
    //     });
    //   setProcessing(false);
    // } catch (error) {
    //   console.log(error);
    //   setProcessing(false);
    // }

    try {
      setProcessing(true);

      // 1. backend || fucctions ---> ccontact to cliant secret
      const response = await axiosInstance.post(
        `/payment/create?total=${total * 100}`
      );
      const clientSecret = response.data?.clientSecret;

      if (!clientSecret) {
        throw new Error("Failed to retrieve clientSecret from backend.");
      }

      // 2. cliant side (react side confirmation)
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        throw new Error(`Payment confirmation failed: ${error.message}`);
      }

      //  3. after confirmation --> order firestore database BiSave,clear basket
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket || [],
          amount: paymentIntent.amount || 0,
          created: paymentIntent.created || Date.now(),
        });
      // empty the basket
      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);
      navigate("/orders", { state: { msg: "You Have Placed New Order" } });
    } catch (error) {
      console.error("Error during payment processing:", error.message);
      setProcessing(false);

      // Optionally display error to the user
      alert(`Payment failed: ${error.message}`);
    }
  };
  return (
    <LayOut>
      <div className="payment_header">Checkout ({totalItem}) items</div>
      <section className="payment">
        <div className="flex">
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 react lain</div>
            <div>addis ababa, Ethiopia</div>
          </div>
        </div>
        <hr />
        <div className="flex">
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard Product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />
        <div className="flex">
          <h3>Payment methods</h3>
          <div className="payment_card_container">
            <div className="payment__details">
              <form onSubmit={handlePayment}>
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                <CardElement onChange={handleChange} />
                <div className="payment__price">
                  <div>
                    <span
                      style={{
                        display: "flex",
                        gap: "10px",
                        paddingTop: "20px",
                      }}
                    >
                      <p> Total Order|</p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button typeof="submit">
                    {processing ? (
                      <div className="loading">
                        <ClipLoader color="grey" size={12} />
                        <p>Please Wait ...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;
