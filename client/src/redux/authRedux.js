/* selectors */
export const getUser = state => state.user;

/* actions */
const createActionName = action => `app/auth/${action}`;
const LOG_IN = createActionName("LOG_IN");
const LOG_OUT = createActionName("LOG_OUT");

/* action creators */
export const logIn = payload => ({ type: LOG_IN, payload });
export const logOut = () => ({ type: LOG_OUT });

/* reducer */
const authReducer = (statePart = { user: null }, action = {}) => {
  switch (action.type) {
    case LOG_IN:
      return action.payload;
    case LOG_OUT:
      return null;
    default:
      return statePart;
  }
};

export default authReducer;
