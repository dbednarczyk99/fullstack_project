import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./styles/bootstrap.scss";
import "./styles/global.scss";
import "./styles/settings.scss";

import MainLayout from "./components/layout/MainLayout/MainLayout";
import HomePage from "./components/pages/HomePage/HomePage";
// import LoginPage from './components/pages/LoginPage/LoginPage';
// import RegisterPage from './components/pages/RegisterPage/RegisterPage';
// import ViewAdvert from './components/pages/ViewAdvert/ViewAdvert';
// import AddAdvert from './components/pages/AddAdvert/AddAdvert';
// import EditAdvert from './components/pages/EditAdvert/EditAdvert';
// import SearchAdvert from './components/pages/SearchAdvert/SearchAdvert';

const App = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(loadProducts());
  // }, [dispatch]);

  return (
    <MainLayout>
      <Switch>
        <Route exact path={"/"} component={HomePage} />
        {/* <Route exact path={'/login'} component={LoginPage} />
        <Route exact path={'/register'} component={RegisterPage} />
        <Route exact path={'/ad/:adId'} component={ViewAdvert} />
        <Route exact path={'/ad/add'} component={AddAdvert} />
        <Route exact path={'/ad/edit/:adId'} component={EditAdvert} />
        <Route exact path={'/search/:searchPhrase'} component={SearchAdvert} /> */}
      </Switch>
    </MainLayout>
  );
};

export default App;
