import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import adsReducer from "./adsRedux";
import authReducer from "./authRedux";

const subreducers = {
  ads: adsReducer,
  auth: authReducer
};

const reducer = combineReducers(subreducers);

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

export default store;
