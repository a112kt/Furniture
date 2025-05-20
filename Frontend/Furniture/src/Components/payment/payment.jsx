import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe("pk_test_51RPpvwHHsbvbtXKSKOO7dgGMMYs4FZnkRToFgU0jzVF5CPQIN66SXeF3CgNMeL5z6kCKBhfTBIyeRN4bDviVLyZh004DhxdABy");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData;

  // Get userId and guestId from localStorage (like in your CartPage)
  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
  const guestId = localStorage.getItem('guestId') || null;

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8000/api/cart/clear', {
        data: { userId, guestId },
        headers,
      });
      console.log("Cart cleared after payment");
    } catch (err) {
      console.error("Failed to clear cart after payment:", err);
      // You can optionally notify user if clearing cart fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !orderData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: orderData.amount * 100 })
      });

      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        toast.error(`Payment failed: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        try {
          await axios.post("http://localhost:8000/api/orders/place", orderData);

          // Clear cart after successful order
          await clearCart();

          toast.success("Payment successful! Thank you for your purchase.");
          setTimeout(() => navigate("/"), 2000); // Redirect to home after 2 seconds
        } catch (dbErr) {
          console.error("Error saving order:", dbErr);
          toast.error("Payment succeeded but failed to save order.");
        }
      }
    } catch (err) {
      setError("Payment failed: " + err.message);
      toast.error("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
      {/* ... باقي الفورم بدون تغيير ... */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Details</h2>
        <p className="text-gray-600">Complete your purchase securely</p>
      </div>

      {orderData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order Total:</span>
            <span className="font-semibold">${orderData.amount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Credit Card Information
        </label>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                  iconColor: "#666ee8",
                },
                invalid: {
                  color: "#ff3d71",
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-colors ${
          loading ? "bg-red-900" : "bg-red-900 hover:bg-red-700"
        } disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Secure payment processed by Stripe</p>
        {/* ... icon/svg ... */}
      </div>
    </form>
  );
};

const PaymentPage = () => {
  return (
    <div className="min-h-screen main_color2 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
