import React, { useState, useEffect } from "react";
import img1 from "./../../assets/headerChair.png";
import { NavLink } from "react-router-dom";
import Products from "../Products/Products";
import light from "./../../assets/light-bulb_8534606.png";
import InteriorDesign from "./../../assets/interior-design_2400622.png";
import OutdoorDesign from "./../../assets/painting_2821314.png";
import { CiTimer } from "react-icons/ci";
import { FiDollarSign } from "react-icons/fi";
import { CiShoppingBasket } from "react-icons/ci";
import { MdOutlinePolicy } from "react-icons/md";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err.message);
      });
  }, []);

  const displayedProducts = products.slice(0, 4);

  // Add Products
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/cart/${userId}/add`,
        { productId, quantity: 1 },
        authHeader
      );

      toast(
        <span>
          Item added to cart!{" "}
          <Link to="/shop" className="underline text-[#270708] font-semibold">
            Go to Cart
          </Link>
        </span>,
        {
          icon: true,
        }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("❌ Failed to add to cart");
    }
  };

  return (
    <>
      {/* Home Section */}
      <div className="Home main_color min-h-100">
        <div className="lg:flex">
          <div className="w-full md:w-1/2 lg:mt-10 p-10 lg:ms-10">
            <h1 className="mt-10">Modern Interior Design Studio</h1>
            <p className="mt-5">
              Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet
              velit. Aliquam vulputate velit imperdiet dolor tempor tristique.
            </p>
            <div className="flex mt-10">
              <NavLink to="/product" className="HomeShop">
                Shop Now
              </NavLink>
            </div>
          </div>
          <div className="Home_chair md:w-1/2 lg:me-40 w-full">
            <img src={img1} alt="Home chair" />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="main_color2 py-10">
        <h1 className="text-center text-3xl font-bold mb-8">
          Best Sellers This Week
        </h1>

        <div className="flex flex-wrap gap-6 justify-center">
          {displayedProducts.map((product) => (
            <div
              key={product._id}
              className="main_color2 shadow-lg rounded-2xl overflow-hidden w-72 text-center transform hover:scale-105 transition duration-300"
            >
             <NavLink  to='/productDetails'>
             <div className="p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <div className="px-4 pb-4">
                <h2 className="text-gray-900 text-lg font-semibold">
                  {product.name}
                </h2>
                <p className=" text-gray-700 mb-3">Price: ${product.price}</p>
                <button
                  onClick={() => addToCart(product._id)}
                  className="main_color hover:bg-green-400 hover:main_color2 text-white text-xl w-10 h-10 rounded-full shadow-md "
                >
                  +
                </button>
              </div>
             </NavLink>
             
            </div>
          ))}
        </div>

        <div className="p-4 text-right">
          <NavLink
            to="/product"
            className="inline-block main_color text-white font-semibold py-2 px-4 rounded-lg"
          >
            All Products 🔜
          </NavLink>
        </div>
      </div>

      {/* Why You Choose Us Section */}
      <div className="main_color2">
        <h1 className="text-center text-2xl fa-font-awesome-flag font-bold pt-10">
          Why You Choose Us
        </h1>
        <div className="flex flex-wrap mt-10">
          {/* Feature 1 */}
          <div className="w-1/2 lg:w-1/4 text-center flex">
            <div className="about m-2 h-full border rounded-lg p-4 flex flex-col justify-between">
              <div className="flex">
                <p className="text-xl text-gray-800 p-2 ms-auto">
                  <CiTimer />
                </p>
                <p className="text-xl font-bold mt-1 me-auto">Fast Delivery</p>
              </div>
              <p className="text-xl p-1">
                We ensure your orders are delivered quickly and on time, right
                to your doorstep.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="w-1/2 lg:w-1/4 text-center flex">
            <div className="about m-2 h-full border rounded-lg p-4 flex flex-col justify-between">
              <div className="flex">
                <p className="text-xl text-gray-800 p-2 ms-auto">
                  <MdOutlinePolicy />
                </p>
                <p className="text-xl font-bold mt-1 me-auto">
                  Secure Policies
                </p>
              </div>
              <p className="text-xl p-1">
                Enjoy peace of mind with our clear return, refund, and privacy
                policies.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="w-1/2 lg:w-1/4 text-center flex">
            <div className="about m-2 h-full border rounded-lg p-4 flex flex-col justify-between">
              <div className="flex">
                <p className="text-xl text-gray-800 p-2 ms-auto">
                  <CiShoppingBasket />
                </p>
                <p className="text-xl font-bold mt-1 me-auto">
                  Simple Shopping
                </p>
              </div>
              <p className="text-xl p-1">
                Our platform is easy to use, making your shopping experience
                smooth and enjoyable.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="w-1/2 lg:w-1/4 text-center flex">
            <div className="about m-2 h-full border rounded-lg p-4 flex flex-col justify-between">
              <div className="flex">
                <p className="text-xl text-gray-800 p-2 ms-auto">
                  <FiDollarSign />
                </p>
                <p className="text-xl font-bold mt-1 me-auto">
                  Flexible Payment
                </p>
              </div>
              <p className="text-xl p-1">
                We offer multiple secure payment options to suit your
                convenience and comfort.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="main_color2">
        <div className="px-10 pb-5">
          <h1 className="text-center text-4xl fa-font-awesome-flag font-bold p-10">
            Our Services
          </h1>

          <div className="Servies flex">
            <div className="w-1/4 lg:ps-20">
              <img
                src={light}
                alt="light"
                className="w-[100px] mt-10 lg:mt-3"
              />
            </div>
            <div className="w-3/4">
              <h2 className="text-2xl fa-font-awesome-flag font-bold text-center">
                Lighting Design
              </h2>
              <p className="text-gray-800 mt-2 ms-2 lg:ms-0">
                We create custom lighting solutions that enhance the mood,
                function, and beauty of your space, using the latest in smart
                and sustainable lighting technology.
              </p>
            </div>
          </div>

          <div className="Servies flex mt-2">
            <div className="w-1/4 lg:ps-20">
              <img
                src={InteriorDesign}
                alt="interior"
                className="w-[100px] mt-10 lg:mt-3"
              />
            </div>
            <div className="w-3/4">
              <h2 className="text-2xl fa-font-awesome-flag font-bold text-center">
                Interior Design
              </h2>
              <p className="text-gray-800 mt-2 ms-2 lg:ms-0">
                Our team transforms interiors into stylish and functional
                environments that reflect your personal taste and fit your
                lifestyle needs.
              </p>
            </div>
          </div>

          <div className="Servies flex mt-2">
            <div className="w-1/4 lg:ps-20">
              <img
                src={OutdoorDesign}
                alt="outdoor"
                className="w-[100px] mt-10 lg:mt-3"
              />
            </div>
            <div className="w-3/4">
              <h2 className="text-2xl fa-font-awesome-flag font-bold text-center">
                Outdoor Design
              </h2>
              <p className="text-gray-800 mt-2 ms-2 lg:ms-0">
                We bring your outdoor spaces to life with elegant, functional
                designs that blend nature and structure seamlessly—perfect for
                relaxation and gatherings.
              </p>
            </div>
          </div>

          <div className="p-4">
            <NavLink to="/servies" className="btn_product block ms-auto">
              More Services 🔜
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
