import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import adsReducer from "./adsRedux";
import authReducer from "./authRedux";
import initialState from "./initialState";

const reducer = combineReducers({
  ads: adsReducer,
  user: authReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
