import React, {Component} from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Input from "react-validation/build/input";
import validator from "validator";
import { signup } from "../redux-actions/auth";
import {connect} from "react-redux";
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai";
import {BsArrowRightCircleFill} from "react-icons/bs";

import "../styles.css";

const required = (input) => {
    if(!input){
        return(
            <div className="alert alert-danger text-center" role="alert">
                Input in this field is required!
            </div>
        );
    }
}

const verifyEmail = (email) => {
    if(!validator.isEmail(email)){
        return(
            <div className="alert alert-danger text-center" role="alert" style={{padding:"10px", marginTop:"5px", width:"30rem", marginLeft:"-6.7rem"}}>
                This email is invalid! Please enter a valid email.
            </div>
        );
    }
}

const verifyUsername = (username) => {
    if(username.length < 3 || username.length > 20){
        return(
            <div className="alert alert-danger text-center" role="alert" style={{padding:"10px", marginTop:"5px", width:"30rem", marginLeft:"-6.7rem"}}>
                Username must be between 3 and 20 characters long!
            </div>
        );
    }
}

const verifyPass = (pass) => {
    if(pass.length < 4 || pass.length > 15){
        return(
            <div className="alert alert-danger text-center" role="alert" style={{padding:"10px", marginTop:"5px", width:"30rem", marginLeft:"-6.7rem"}}>
                Password must be between 4 and 15 characters long!
            </div>
        );
    }
}

class SignUp extends Component{
    
    constructor(props){
        super(props);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleChangeOnUsername = this.handleChangeOnUsername.bind(this);
        this.handleChangeOnEmail = this.handleChangeOnEmail.bind(this);
        this.handelChangeOnPass = this.handelChangeOnPass.bind(this);
        this.handleShowHidePass = this.handleShowHidePass.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            success: false,
            visible: false,
            selected_pass: false,
            selected_username: false,
            selected_email: false,
        }
    }

    handleShowHidePass = () =>{
        const visibility = this.state.visible;
        this.setState({
            visible: !visibility,
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

    handleChangeOnEmail(input){
        this.setState({
            email: input.target.value,
            selected_email: true,
        });
        if(input.target.value===""){
            this.setState({
                selected_email: false,
            });
        }
    }

    handelChangeOnPass(input){
        this.setState({
            password: input.target.value,
            selected_pass: true,
        })
        if(input.target.value===""){
            this.setState({
                selected_pass: false,
            });
        }
    }

    handleSignUp(input){

        input.preventDefault();

        this.setState({
            success: false,
        });

        this.form.validateAll();

        if(this.CheckBtn.context._errors.length === 0){
            this.props.dispatch(
                signup(
                    this.state.username,
                    this.state.email,
                    this.state.password 
                )
            )
            .then(()=>{
                this.setState({
                    success: true,
                });
            })
            .catch(()=>{
                this.setState({
                    success: false,
                });
            });
        }
    }

    render(){
        
        const {message} = this.props;

        return(
            <div className="main-image" style={{paddingTop:"6rem"}}>
                <div className="card card-container">
                <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card"/>

                <Form onSubmit={this.handleSignUp} ref={(e)=>{this.form=e;}}>
                    
                    {!this.state.success && (
                        <div>
                            <div className="form-group text-center">
                                <label htmlFor="username" style={{paddingBottom:"4px"}}>Username</label>
                                <Input type="text" 
                                placeholder="Create a username"
                                className="form-control text-center" 
                                name="username" 
                                style={this.state.selected_username ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem",TransitionEvent:"2s"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                                autoComplete="username"
                                value={this.state.username} 
                                onChange={this.handleChangeOnUsername} 
                                validations={[verifyUsername,required]}/>
                            </div>

                            <div className="form-group text-center">
                                <label htmlFor="email" style={{paddingBottom:"4px"}}>Email</label>
                                <Input type="text" 
                                placeholder="Enter your email"
                                className="form-control text-center" 
                                name="email" 
                                style={this.state.selected_email ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem",TransitionEvent:"2s"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                                autoComplete="email"
                                value={this.state.email} 
                                onChange={this.handleChangeOnEmail} 
                                validations={[verifyEmail,required]}/>
                            </div>

                            <div className="form-group text-center">
                                <i onClick={this.handleShowHidePass} className="show-hide" style={this.state.selected_pass ? {marginLeft:"11rem"}:{}}>{this.state.visible ? <AiOutlineEye/> : <AiOutlineEyeInvisible/> }</i>
                                <label htmlFor="password" style={{paddingBottom:"4px"}}>Password</label>
                                <Input type={this.state.visible ? "text" : "password"}
                                placeholder="Create a password" 
                                className="form-control text-center" 
                                name="password" 
                                style={this.state.selected_pass ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem",TransitionEvent:"2s"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                                autoComplete="new-password"
                                value={this.state.password} 
                                onChange={this.handelChangeOnPass} 
                                validations={[verifyPass,required]}/>
                            </div>

                            <div className="form-group text-center">
                                <button className="btn btn-primary btn-block" style={{borderRadius:"10px", backgroundColor:"#145364", border: "none"}}>Sign Up</button>
                            </div>
                        </div>
                    )}
                    
                    {message && (
                        <div className="form-group">
                            <div className={this.state.success ? "alert alert-success text-center" : "alert alert-danger text-center"} role="alert">
                                {message}
                            </div>
                        </div>
                    )}

                    {this.state.success && (
                        <div className="text-center">
                            <a href="/signin" style={{textDecorationLine:"none"}}><i style={{color:"#0d4555"}}>Go to Sign In <BsArrowRightCircleFill size={30}/></i></a>
                        </div>
                    )}

                    <CheckButton style={{display:"none"}} ref={(e)=>{this.CheckBtn=e;}}/>

                </Form>
                </div>
            </div>
        );
    }
}

function map(state){
    const {message} = state.message;
    return{
        message,
    };
}

export default connect(map)(SignUp);
