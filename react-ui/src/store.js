import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';
import locationReducer from './location/locationSlice';

export default configureStore({
  reducer: combineReducers({
    auth: authReducer,
    location: locationReducer,
  }),
});

// export default configureStore({
//   reducer: { auth: authReducer },
//   // reducer: { location: locationReducer },
// });
