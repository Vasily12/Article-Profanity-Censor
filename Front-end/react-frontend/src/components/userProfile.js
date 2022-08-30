import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {BiCrown} from "react-icons/bi";

class UserProfile extends Component{

    render(){
        const {user:currUser} = this.props;

        return(
                <div className="main-image" style={{paddingTop:"17rem"}}>
                    
                    <header className="form-group text-center">
                        <i className="crown-icon" ><BiCrown size={30} color="white"/></i>
                        <h1><strong>{currUser.username}</strong></h1>
                        <h4 style={{marginTop:"2rem"}}> Profile Options</h4>
                    </header>
                    
                    <div className="email-password-change-container text-center">
                        <div className="change-label text-end">
                            <label style={{marginBottom:"1.5rem"}}><strong>Current Email:</strong></label>
                            <label><strong>Current Password:</strong></label>
                        </div>
                        <div className="change-label text-center">
                            <label style={{marginBottom:"1.5rem"}}>{currUser.email}</label>
                            <label>•••••••••••••</label>
                        </div>
                        <div className="change-label text-center">
                            <Link to="/change/email">
                                <button className="change-btn" style={{marginTop:"5px",marginBottom:"0.8rem"}}>Change</button>
                            </Link>
                            <Link to="/change/password">
                                <button className="change-btn">Change</button>
                            </Link>
                        </div>
                    </div>
                </div>
        );
    }
}

function map(state){
    const {user} = state.auth;
    return{
        user,
    };
}

export default connect(map)(UserProfile);