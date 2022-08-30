import {SIGNIN_SUCCESS,SIGNIN_FAIL,SIGNUP_SUCCESS,SIGNUP_FAIL,SET_MESSAGE,SIGNOUT,CHANGE_SUCCESSFULL,CHANGE_FAILED,SAVE_SUCCESSFULL,SAVE_FAILED} from "./type";
import authService from "../services/authService";
import userService from "../services/userService";

//Redux sign-in action
export const signin = (username, password) => (dispatch) => {
    //Calls the sign-in method in authenticaton service
    return authService.signin(username, password).then(
        (data) => {
            dispatch({
                type: SIGNIN_SUCCESS,
                payload: {user: data},
            });
            //Returns a promise object with the user's data passed from Spring Boot back-end
            return Promise.resolve();
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message)||
            error.message||
            error.toString();

            //Updates the reducer
            dispatch({
                type: SIGNIN_FAIL,
            });

            //Calls a reducer to set an error message
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            //Rejects a promise and returns a message
            return Promise.reject();
        }
    );
};

export const signup = (username, email, password) => (dispatch) => {
    return authService.signup(username,email,password).then(
        (response) => {
            dispatch({
                type: SIGNUP_SUCCESS,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            });
            return Promise.resolve();
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message)||
            error.message||
            error.toString();

            dispatch({
                type: SIGNUP_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};

export const changeUserEmail = (currentEmail, newEmail) => (dispatch) => {
    return userService.changeUserEmail(currentEmail,newEmail).then(
        (response) => {
            dispatch({
                type: CHANGE_SUCCESSFULL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message
            });
            return Promise.resolve();
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message)||
            error.message||
            error.toString();

            dispatch({
                type: CHANGE_FAILED,
            });

            dispatch({
                type:SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};

export const changeUserPassword = (currentPassword, newPassword, email) => (dispatch) => {
    return userService.changeUserPassword(currentPassword, newPassword, email).then(
        (response) => {
            dispatch({
                type: CHANGE_SUCCESSFULL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message
            });
            return Promise.resolve();
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message)||
            error.message||
            error.toString();

            dispatch({
                type: CHANGE_FAILED,
            });

            dispatch({
                type:SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};

export const saveSearchedArticle = (email, title, url) => (dispatch) =>{
    return userService.saveSearchedArticle(email, title, url).then(
        (response) => {
            dispatch({
                type: SAVE_SUCCESSFULL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            });
            return Promise.resolve();
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message)||
            error.message||
            error.toString();

            dispatch({
                type: SAVE_FAILED,
            });

            dispatch({
                type:SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
}

export const signout = () => (dispatch) => {
    authService.signout();

    dispatch({
        type: SIGNOUT,
    });
}