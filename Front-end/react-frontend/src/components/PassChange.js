import React, {Component} from "react";
import { changeUserPassword } from "../redux-actions/auth";
import Form from "react-validation/build/form"
import Input from "react-validation/build/input"
import {connect} from "react-redux";
import {AiOutlineEyeInvisible,AiOutlineEye} from "react-icons/ai";
import {IoArrowUndo} from "react-icons/io5";

import "../styles.css";


const required = (input) =>{
    if (!input){
        return(
            <div className="alert alert-danger text-center" role="alert">
                Input in this field is required!
            </div>
        );
    }
};

const verifyPass = (pass) => {
    if(pass.length < 4 || pass.length > 15){
        return(
            <div className="alert alert-danger text-center" role="alert">
                Password must be between 4 and 15 characters long!
            </div>
        );
    }
};

class PassChange extends Component{

    constructor(props){
        super(props);

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleChangeOnNewPass = this.handleChangeOnNewPass.bind(this);
        this.handleChangeOnCurrPass = this.handleChangeOnCurrPass.bind(this);
        this.handleShowHidePass1 = this.handleShowHidePass1.bind(this);
        this.handleShowHidePass2 = this.handleShowHidePass2.bind(this);

        this.state = {
            currentPassword: "",
            newPassword: "",
            success: false,
            visible1: false,
            visible2: false,
            selected_pass1: false,
            selected_pass2: false,
        }
    }

    handleShowHidePass1 = () =>{
        const visibility1 = this.state.visible1;
        this.setState({
            visible1: !visibility1,
        });
    }

    handleShowHidePass2 = () =>{
        const visibility2 = this.state.visible2;
        this.setState({
            visible2: !visibility2,
        });
    }

    handleChangeOnCurrPass(input){
        this.setState({
            currentPassword: input.target.value,
            selected_pass1: true,
        });
        if(input.target.value===""){
            this.setState({
                selected_pass1: false,
            });
        }
    }

    handleChangeOnNewPass(input){
        this.setState({
            newPassword: input.target.value,
            selected_pass2: true,
        });
        if(input.target.value===""){
            this.setState({
                selected_pass2: false,
            });
        }

    }

    handlePassChange(input){
        input.preventDefault();

        const {user:currUser} = this.props;

        this.form.validateAll();

        this.props.dispatch(changeUserPassword(this.state.currentPassword, this.state.newPassword, currUser.email))
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

    render(){
        const { message } = this.props;

        return(
            <div className="main-image" style={{paddingTop:"10rem"}}>
                <div className="card card-container"> 
                <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card"/>

                <Form onSubmit={this.handlePassChange} ref={(e)=>{this.form=e;}}>
                    
                    {!this.state.success && (
                        <div>
                            <div className="form-group text-center">
                                <i onClick={this.handleShowHidePass1} className="show-hide" style={this.state.selected_pass1 ? {marginLeft:"11rem"}:{}}>{this.state.visible1 ? <AiOutlineEye/> : <AiOutlineEyeInvisible/> }</i>
                                <label htmlFor="password" style={{paddingBottom:"4px"}}>Current Password</label>
                                <Input type={this.state.visible1 ? "text" : "password"} 
                                placeholder="Enter current password here"
                                className="form-control text-center" 
                                name="password" 
                                style={this.state.selected_pass1 ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                                autoComplete="current-password"
                                value={this.state.currentPassword} 
                                onChange={this.handleChangeOnCurrPass} 
                                validations={[required]}/>
                            </div>

                            <div className="form-group text-center">
                                <i onClick={this.handleShowHidePass2} className="show-hide" style={this.state.selected_pass2 ? {marginLeft:"11rem"}:{}}>{this.state.visible2 ? <AiOutlineEye/> : <AiOutlineEyeInvisible/> }</i>
                                <label htmlFor="password" style={{paddingBottom:"4px"}}>New Password</label>
                                <Input type={this.state.visible2 ? "text" : "password"} 
                                placeholder="Enter new password here"
                                className="form-control text-center" 
                                name="password" 
                                style={this.state.selected_pass2 ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                                autoComplete="new-password"
                                value={this.state.newPassword} 
                                onChange={this.handleChangeOnNewPass} 
                                validations={[verifyPass,required]}/>
                            </div>

                            <div className="form-group text-center">
                                <button className="btn btn-primary btn-block" style={{borderRadius:"10px", backgroundColor:"#145364", border: "none"}}>Change</button>
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

                    <div className="form-group text-center" style={{marginTop: "5rem"}}>
                        <a href="/profile" style={{textDecorationLine:"none"}}><i style={{color:"#0d4555"}}><IoArrowUndo size={20}/> previous</i></a>
                    </div>

                </Form>
                </div>
            </div>
        );
    }
}

function map(state){
    const {user} = state.auth;
    const {message} = state.message;
    return{
        user,
        message,
    };
}

export default connect(map)(PassChange);