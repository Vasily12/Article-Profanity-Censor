import axios from "axios";

const BACKEND_API = "http://localhost:8080/api/v1/auth";

class authService {
    //Sign-in service
    signin(username, password){
        return axios
            //Sends a POST request to the Spring Boot back-end API
            .post(BACKEND_API + "/signin", {username, password})
            .then((res)=>{
                //If authentication is successful a JWT token should be present
                if (res.data.token){
                    //Save the user details object recieved from the back-end to local storage
                    localStorage.setItem("user", JSON.stringify(res.data));
                }
                return res.data;
            });
    }

    signup(username, email, password){
        return axios
            .post(BACKEND_API + "/signup", {username, email, password});
    }

    signout(){
        localStorage.removeItem("user");
    }
}

export default new authService();