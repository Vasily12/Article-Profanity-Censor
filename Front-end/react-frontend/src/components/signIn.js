import React, {Component} from "react";
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Input from "react-validation/build/input";
import {connect} from "react-redux";
import {signin} from "../redux-actions/auth";
import Home from "./Home";
import { Navigate } from "react-router-dom";

import { clearMessage } from "../redux-actions/message";

import "../styles.css";

<link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"/>

const required = (input) =>{
    if (!input){
        return(
            <div className="alert alert-danger text-center" style={{position:"relative", marginTop:"5px", padding:"10px"}}role="alert">
                Input in this field is required!
            </div>
        );
    }
};

class SignIn extends Component{
    constructor(props){
        super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleChangeOnUsername = this.handleChangeOnUsername.bind(this);
        this.handleChangeOnPass = this.handleChangeOnPass.bind(this);
        this.handleShowHidePass = this.handleShowHidePass.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            visable: false,
            selected_pass: false,
            selected_username: false,
        };
    }

    handleShowHidePass = () =>{
        const visability = this.state.visable;
        this.setState({
            visable: !visability,
        });
    }
    
    handleChangeOnUsername(input){
        this.setState({
            username: input.target.value,
            selected_username: true,
        });
        if(input.target.value===""){
            this.setState({
                selected_username: false,
            });
        }
    }

    handleChangeOnPass(input){
        
        
        this.setState({
            password: input.target.value,
            selected_pass: true,
        });
        if(input.target.value===""){
            this.setState({
                selected_pass: false,
            });
        }
    }
    
    handleSignIn(input){
        //Prevents button press when component is loading up
        input.preventDefault();

        this.setState({
            loading: true,
        });

        this.form.validateAll();

        const {dispatch, history} = this.props;

        //Dispatches the redux sign-in action
        if (this.CheckBtn.context._errors.length === 0){
            dispatch(signin(this.state.username, this.state.password))
            .then(()=>{
                //User is redirected to Home component if sign-in was successful
                window.location.reload();
                history.push("/home");
            })
            .catch(()=>{
                this.setState({
                  loading: false,
                });
            });
        }  
        else{
            this.setState({
                loading: false,
            });
        }
    }
    
    render(){
        const {isSignedIn, message} = this.props;

        if(isSignedIn){
            return <Navigate to="/home" element={<Home/>}/>
        }

        if(message==="Registered Successfully"){
            this.props.dispatch(clearMessage());
        }

        return(
            <div className="main-image" style={{paddingTop:"10rem"}}>
                <div className="card card-container">
                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card"/>

                    <Form onSubmit = {this.handleSignIn} 
                        ref = {(e) => {
                            this.form = e;
                        }}
                        >
                        <div className="form-group text-center">
                            <label htmlFor="username" style={{paddingBottom:"4px"}}>Username</label>
                            <Input type="text" 
                            placeholder="Enter your username"
                            className="form-control text-center" 
                            name="username"
                            style={this.state.selected_username ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem",TransitionEvent:"2s"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                            autoComplete="username"
                            value={this.state.username} 
                            onChange={this.handleChangeOnUsername} 
                            validations={[required]}
                            />
                        </div>

                        <div className="form-group text-center">
                            <i onClick={this.handleShowHidePass} className="show-hide" style={this.state.selected_pass ? {marginLeft:"11rem"}:{}}>{this.state.visable ? <AiOutlineEye/> : <AiOutlineEyeInvisible/> }</i>
                            <label htmlFor="password" style={{paddingBottom:"4px"}}>Password</label>
                            <Input type={this.state.visable ? "text" : "password"}
                            placeholder="Enter your password"
                            className="form-control text-center" 
                            style={this.state.selected_pass ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                            name="password" 
                            autoComplete="current-password"
                            value={this.state.password} 
                            onChange={this.handleChangeOnPass} 
                            validations={[required]}
                            />
                        </div>
                        
                        <div className="form-group text-center">
                            <button className="btn btn-primary btn-block" disabled={this.state.loading} style={{borderRadius:"10px", backgroundColor:"#145364", border: "none"}}>
                                {this.state.loading && (
                                    <span className="spinner-boarder spinner-boarder-sm"></span>
                                )}
                                Sign In
                            </button>
                        </div>  
                        
                        {message && (
                            <div className="form-group">
                                <div className="alert alert-danger text-center" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}

                        <CheckButton style = {{display: "none"}} 
                        ref = {(e)=>{
                            this.CheckBtn=e;
                        }}/>
                    </Form>
                </div>
            </div>
        );
    }
}

function map(state){
    const {isSignedIn} = state.auth;
    const {message} = state.message;
    
    return{
        isSignedIn, message
    };
}

export default connect(map)(SignIn);