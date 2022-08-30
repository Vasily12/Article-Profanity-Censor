import React, {Component} from "react";
import validator from "validator";
import { changeUserEmail } from "../redux-actions/auth";
import Form from "react-validation/build/form"
import Input from "react-validation/build/input"
import {connect} from "react-redux";
import {IoArrowUndo} from "react-icons/io5";



const verifyEmail = (email) => {
    if(!validator.isEmail(email)){
        return(
            <div className="alert alert-danger text-center" role="alert">
                This email is invalid! Please enter a valid email.
            </div>
        );
    }
}


class EmailChange extends Component{

    constructor(props){
        super(props);

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleChangeOnNewEmail = this.handleChangeOnNewEmail.bind(this);

        this.state = {
            newEmail: "",
            success: false,
            selected_email: false,
        }
    }

    handleChangeOnNewEmail(input){
        this.setState({
            newEmail: input.target.value,
            selected_email: true,
        });
        if(input.target.value===""){
            this.setState({
                selected_email: false,
            });
        }
    }

    handleEmailChange(input){
        
        input.preventDefault();

        const {user:currUser} = this.props;

        this.form.validateAll();

        this.props.dispatch(changeUserEmail(currUser.email, this.state.newEmail))
        .then(()=>{
            this.setState({
                success: true,
            });
            const user = JSON.parse(localStorage.getItem("user"));
            user.email = this.state.newEmail;
            localStorage.setItem("user", JSON.stringify(user));
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

                <Form onSubmit={this.handleEmailChange} ref={(e)=>{this.form=e;}}>
                    
                    {!this.state.success && (
                        <div>
                            <div className="form-group text-center">
                                <label htmlFor="email" style={{paddingBottom:"4px"}}>New Email</label>
                                <Input type="text" 
                                placeholder="Enter new email here"
                                className="form-control text-center" 
                                name="email" 
                                style={this.state.selected_email ? {backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey", width:"25rem", marginLeft:"-4.05rem",TransitionEvent:"2s"}:{backgroundColor:"#E4E4E4", borderRadius:"10px", outline:"1px solid grey"}}
                                autoComplete="email"
                                value={this.state.newEmail} 
                                onChange={this.handleChangeOnNewEmail} 
                                validations={[verifyEmail]}/>
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

export default connect(map)(EmailChange);