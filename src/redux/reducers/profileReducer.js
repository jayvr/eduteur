const initState = {
    profileLoaded: false,

}

const porfileReducer = (state = initState, action) => {
    switch (action.type) {
        case 'PROFILE_ERROR':
            console.log('login error');
            return {
                ...state,
                profileLoaded: false
            }
        case 'PROFILE_SUCCESS':
            console.log('login success');
            return {
                profileLoaded: true
            }
        default:
            return state
    }
};

export default porfileReducer;
