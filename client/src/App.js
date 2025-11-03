// App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";

import "./styles/bootstrap.scss";
import "./styles/global.scss";
import "./styles/settings.scss";

import HomePage from "./components/pages/HomePage/HomePage";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import AdvertPage from "./components/pages/AdvertPage/AdvertPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import LogoutPage from "./components/pages/LogoutPage/LogoutPage";
import RegisterPage from "./components/pages/RegisterPage/RegisterPage";
import { API_URL } from "./config";
import { logIn, logOut } from "./redux/authRedux";
import AddAdvert from "./components/pages/AddAdvert/AddAdvert";
import EditAdvert from "./components/pages/EditAdvert/EditAdvert";
import SearchPage from "./components/pages/SearchPage/SearchPage";
import Banner from "./components/common/Banner/Banner";

const App = () => {
  const dispatch = useDispatch();
  //check if user is logged in
  React.useEffect(() => {
    console.log("Checking if user is logged in...");
    fetch(`${API_URL}auth/user`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("User data response:", data);
        if (data.user) {
          const login = data.user;
          dispatch(logIn(data.user));
          console.log("User is logged in:", login);
        } else {
          console.log("No user logged in");
          dispatch(logOut());
        }
      })
      .catch(err => console.log(err));
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Banner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ad/:adId" element={<AdvertPage />} />
        <Route path="/ad/add" element={<AddAdvert />} />
        <Route path="/ad/edit/:adId" element={<EditAdvert />} />
        <Route path="/search/:searchPhrase" element={<SearchPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
