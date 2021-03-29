import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import discussReducer from './discussReducer'
import subjectReducer from "./subjectReducer"

import { combineReducers } from 'redux'
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,  
  discuss: discussReducer,
  dashboard: dashboardReducer,
  subject: subjectReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
