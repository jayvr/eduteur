import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider, useSelector } from 'react-redux';
import rootReducer from './redux/reducers/rootReducer';
import thunk from 'redux-thunk';
import { createFirestoreInstance, reduxFirestore, getFirestore } from 'redux-firestore';
import { ReactReduxFirebaseProvider, getFirebase, isLoaded } from "react-redux-firebase";
import firebase from "./firebase/firebaseconfig";
import Loading from "./components/LoadingComponent"

const store = createStore(rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    // reactReduxFirebase(firebase), // redux binding for firebase
    reduxFirestore(firebase) // redux bindings for firestore
  ),
);


// const rrfConfig = {
//   useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
// }

const rrfProps = {
  firebase,
  config: {
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    userProfile: 'enduser'
  },
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
};

// display loding until user is authenticated
function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(auth)) {
    return (
      <Loading message="Authenticating..." />
    );
  }
  return children
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <React.StrictMode>
        <AuthIsLoaded>
          <App />
        </AuthIsLoaded>
      </React.StrictMode>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);
