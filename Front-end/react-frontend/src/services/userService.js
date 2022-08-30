import axios from "axios";
import authHeader from "./authHeader";

const BACKEND_API = "http://localhost:8080/api/v1";

class userService{

    getAllUsers(){
        return axios.get(BACKEND_API + "/users", {headers: authHeader()});
    }

    changeUserEmail(currentEmail, newEmail){
        return axios.post(BACKEND_API + "/change/email",{currentEmail, newEmail});
    }

    changeUserPassword(currentPassword, newPassword, email){
        return axios.post(BACKEND_API + "/change/password",{currentPassword, newPassword, email});
    }

    saveSearchedArticle(email, title, url){
        return axios.post(BACKEND_API + "/save/article",{email, title, url});
    }

    loadSavedArticles(email){
        return axios.post(BACKEND_API + "/get/articles",{email});
    }

    deleteSavedArticle(email, title){
        return axios.post(BACKEND_API + "/delete/article", {email, title});
    }
}

export default new userService();