export default function authHeader(){
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.JwtResToken){
        return {Authorization: 'Bearer '+ user.JwtResToken};
    }
    else{
        return {};
    }
}