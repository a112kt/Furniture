import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize cart state from passed location state or empty array
  const [cart, setCart] = useState(location.state?.cart || []);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount from cart items
  const totalAmount = cart.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on input change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    // Validate inputs before submitting
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to place an order");
        navigate("/login", { state: { from: location.pathname } });
        setIsSubmitting(false);
        return;
      }

      // Decode user ID from JWT token
      const userId = JSON.parse(atob(token.split(".")[1])).userId;

      // Prepare order data object
      const orderData = {
        userId,
        items: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        amount: totalAmount,
        paymentMethod,
        customerInfo: formData,
      };

      if (paymentMethod === "cash") {
        // Send order data to backend
        const response = await axios.post(
          "http://localhost:8000/api/orders/place",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Clear user's cart on backend after order success
        await axios.delete("http://localhost:8000/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId },
        });

        // Clear cart in the frontend state
        setCart([]);

        // Show success toast with order details
        toast.success(
          <div>
            <h3 className="font-bold">Order Placed Successfully!</h3>
            <p>Order ID: {response.data.orderId}</p>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            <p>We'll contact you shortly for confirmation.</p>
          </div>,
          {
            autoClose: 10000,
            closeButton: true,
          }
        );

        // Redirect to homepage
        navigate("/");
      } else {
        // If payment method is card, navigate to payment page
        navigate("/payment", { state: { orderData } });
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to cart page if cart is empty
  useEffect(() => {
    if (!cart.length) {
      toast.warn("Your cart is empty");
      navigate("/shop");
    }
  }, [cart, navigate]);

  return (
    <div className="min-h-screen main_color2 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side: Delivery info and payment method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>

            <div className="space-y-4">
              {/* Name input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Address input */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Delivery Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123 Main St, City, Country"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Phone input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Payment method selection */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="cash"
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="cash"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Cash on Delivery
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="card"
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="card"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Credit/Debit Card
                </label>
              </div>
            </div>
          </div>

          {/* Right side: Order summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div
                  key={item.productId._id}
                  className="py-4 flex justify-between"
                >
                  <div>
                    <h3 className="text-md font-medium">{item.productId.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-md font-medium">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className={`mt-6 w-full py-3 px-4 rounded-md text-white font-medium ${
                isSubmitting
                  ? "bg-red-900 cursor-not-allowed"
                  : "bg-red-900 hover:bg-red-700"
              } transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
