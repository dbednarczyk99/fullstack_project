// adsRedux.js

/* imports */
import { API_URL } from "../config";

/* selectors */
export const getAllAds = ({ ads }) => ads;
export const getAdById = (state, adId) => state.ads.find(ad => ad._id === adId);
export const getAdsByPhrase = ({ ads }, phrase) =>
  ads.filter(
    ad =>
      ad.title.toLowerCase().includes(phrase.toLowerCase()) ||
      ad.author.login.toLowerCase().includes(phrase.toLowerCase())
  );

/* actions */
const createActionName = action => `app/ads/${action}`;
const GET_ADS = createActionName("GET_ADS");
const REMOVE_AD = createActionName("REMOVE_AD");
const ADD_AD = createActionName("ADD_AD");
const EDIT_AD = createActionName("EDIT_AD");

/* action creators */
export const getAds = payload => ({ type: GET_ADS, payload });
export const removeAd = payload => ({ type: REMOVE_AD, payload });
export const addAd = payload => ({ type: ADD_AD, payload });
export const editAd = payload => ({ type: EDIT_AD, payload });

/* thunks */
export const fetchAds = () => dispatch => {
  fetch(`${API_URL}api/ads`)
    .then(res => res.json())
    .then(data => dispatch(getAds(data)));
};

/* reducer */
const adsReducer = (statePart = [], action = {}) => {
  switch (action.type) {
    case GET_ADS:
      return [...action.payload];
    case REMOVE_AD:
      return statePart.filter(ad => ad._id !== action.payload);
    case ADD_AD:
      return [...statePart, { ...action.payload }];
    case EDIT_AD:
      return statePart.map(ad =>
        ad._id === action.payload._id ? { ...action.payload } : ad
      );
    default:
      return statePart;
  }
};

export default adsReducer;
