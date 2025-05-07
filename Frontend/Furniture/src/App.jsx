import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import AboutAs from './Components/AboutAs/AboutAs'  
import Shop from './Components/Shop/Shop'
import Products from './Components/Products/Products'
import Servies from './Components/Servies/Servies'
<<<<<<< HEAD

=======
import Blog from './Components/Blog/Blog'
>>>>>>> 8a816bc5778d20eece027ef7d39995361651e6fa
import ContactUS from './Components/ContactUS/ContactUS'
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword'
import GetCode from './Components/GetCode/GetCode'
import ChangePassword from './Components/ChangePassword/ChangePassword'
import Logout from './Components/Logout/Logout'
<<<<<<< HEAD
import ProductDetails from './Components/ProductDetails/ProductDetails'
=======
>>>>>>> 8a816bc5778d20eece027ef7d39995361651e6fa

function App() {
  let routes = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
<<<<<<< HEAD
        { path: "aboutAs", element: <AboutAs /> },  
        { path: "shop", element: <Shop /> },
        { path: "product", element: <Products /> },
        { path: "servies", element: <Servies /> },
=======
        { path: "aboutAs", element: <AboutAs /> },  {/* تم تصحيح المسار */},
        { path: "shop", element: <Shop /> },
        { path: "product", element: <Products /> },
        { path: "servies", element: <Servies /> },
        { path: "blog", element: <Blog /> },
>>>>>>> 8a816bc5778d20eece027ef7d39995361651e6fa
        { path: "contactUs", element: <ContactUS /> },
        { path: "login", element: <Login /> },
        { path: "signUp", element: <SignUp /> },
        { path: "forgetpassword", element: <ForgetPassword /> },
        { path: "getcode", element: <GetCode /> },
        { path: "changePassword", element: <ChangePassword /> },
<<<<<<< HEAD
        { path: "logout", element: <Logout /> },
        { path: "productDetails", element: <ProductDetails /> }
=======
        { path: "logout", element: <Logout /> }
>>>>>>> 8a816bc5778d20eece027ef7d39995361651e6fa
      ]
    }
  ])

  return (
    <RouterProvider router={routes} />
  )
}

export default App;
