import { SIGNIN_SUCCESS, SIGNIN_FAIL, SIGNUP_SUCCESS, SIGNUP_FAIL, SIGNOUT ,CHANGE_SUCCESSFULL, CHANGE_FAILED, SAVE_SUCCESSFULL, SAVE_FAILED, LOAD_SUCCESSFULL, LOAD_FAILED} from "../redux-actions/type"; 

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? {isSignedIn: true, user} : {isSignedIn: false, user: null};



export default function auth(state = initialState, action){
    const {type, payload} = action;

    switch(type){
        case SIGNIN_SUCCESS:
            return{
                ...state,
                isSignedIn: true,
                user: payload.user,
            };
        case SIGNIN_FAIL:
            return{
                ...state,
                isSignedIn: false,
                user: null,
            };
        case SIGNUP_SUCCESS:
            return{
                ...state,
                isSignedIn: false,
            };
        case SIGNUP_FAIL:
            return{
                ...state,
                isSignedIn: false,
            };
        case SIGNOUT:
            return{
                ...state,
                isSignedIn: false,
                user: null,
            };
        case CHANGE_SUCCESSFULL:
            return{
                ...state,
                isSignedIn: true,
            };
        case CHANGE_FAILED:
            return{
                ...state,
                isSignedIn: true,
            };
        case SAVE_SUCCESSFULL:
            return{
                ...state,
                isSignedIn: true,
            };
        case SAVE_FAILED:
            return{
                ...state,
                isSignedIn: true,
            };
        case LOAD_SUCCESSFULL:
            return{
                ...state,
                isSignedIn: true,
            };
        case LOAD_FAILED:
            return{
                ...state,
                isSignedIn: false,
            };
        default:
            return state;
    }
}