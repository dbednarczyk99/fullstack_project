// authenticator.js

import { useSelector } from "react-redux";
import { getUser } from "../redux/authRedux";
import { getAdById } from "../redux/adsRedux";

export const useIsOwner = adId => {
  const ad = useSelector(state => getAdById(state, adId));
  const user = useSelector(getUser);
  return user && ad && user.id === ad.author._id;
};

export const useIsLoggedIn = () => {
  const user = useSelector(getUser);
  if (user === undefined) return false;
  else return user;
};
