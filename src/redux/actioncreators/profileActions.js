export const LoadProfile = (credentials) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.mail,
            credentials.pass
        ).then((res) => {
            console.log("Login Success");
            // console.log(state);
            dispatch({ type: 'LOGIN_SUCCESS' });
        }).catch((err) => {
            // console.log("Error")
            dispatch({ type: 'LOGIN_ERROR', err });
        });
    }
}