import React, {Component} from "react";
import "../styles.css";
import {connect} from "react-redux";
import {BiArrowFromLeft} from "react-icons/bi";
import { Link } from "react-router-dom";

class Home extends Component{

    constructor(props){
        super(props);

        this.state = {
            isSignedIn: false,
            hover1: false,
            hover2: false,
            hover3: false,
        };
    }

    componentDidMount(){
        const user = this.props.user;
    
        if(user){
          this.setState({
            isSignedIn: true,
          });
        }
    }

    render(){
        const {user:currUser} = this.props;

        return(
            <div className="main-image">
                {this.state.isSignedIn ? (
                    <div className="text-center" style={{paddingTop: "12rem", marginLeft:"-1.7rem"}}>
                        <h1>Welcome to <strong>myArticleCensor</strong>, {currUser.username}</h1>
                    </div>
                ):(
                    <div className="text-center" style={{paddingTop: "13rem"}}>
                        <h1>Welcome to <strong>myArticleCensor</strong></h1>
                    </div>
                )}
                <Link to={"/search/article"} style={{textDecoration:"none", color:"black", fontFamily:"'PT Sans', sans-serif"}}>
                <div className="functionality-1" onMouseEnter={()=>this.setState({hover1:true})} onMouseLeave={()=>this.setState({hover1:false})}>
                    <p style={!this.state.isSignedIn ? {width:"40rem", marginBottom:"-0.1rem", marginTop:"-0.8rem"} : {width:"40rem", marginBottom:"-0.5rem", marginTop:"-0.5rem"}}><h5><strong>Find, Censor and Analyse</strong></h5>
                    This website gives you the freedom of finding, censoring and analysing your favourite online articles. No hastle. Just insert the URL of the article you want to be scanned and the website will do the rest. After the website scans your article it will display it right in-front of you with no need to follow external links!
                    {!this.state.isSignedIn &&(
                        <p style={{marginTop:"10px",marginBottom:"-10px", fontSize:"12px"}}><strong>* No need to register or login to get started</strong></p>
                    )}
                    </p>
                    <i className="home-icon" style={!this.state.isSignedIn ? {marginLeft: "3rem", marginTop:"2.7rem"}:{marginLeft: "3rem", marginTop:"2.3rem"}}><BiArrowFromLeft size={35} color={this.state.hover1 ? "white" : "black"}/></i>
                </div>
                </Link>
                {!this.state.isSignedIn && (
                <Link to={"/signup"} style={{textDecoration:"none", color:"black", fontFamily:"'PT Sans', sans-serif"}}>
                <div className="functionality-2" onMouseEnter={()=>this.setState({hover2:true})} onMouseLeave={()=>this.setState({hover2:false})}>
                    <p style={{width:"40rem", marginBottom:"-0.1rem", marginTop:"-0.8rem"}}><h5><strong>Sign-up and Login to Access More Features</strong></h5>
                    After signing up, your credentials will be safely and securely stored in our database and you will gain full user access to this website. Some of the features you will gain access to are saving your favourite articles and comparing statistics of any two articles. Just register and login to get started!
                    <p style={{marginTop:"10px",marginBottom:"-10px", fontSize:"12px"}}><strong>* Must be a registered user</strong></p>
                    </p>
                    <i className="home-icon" style={{marginLeft: "3rem", marginTop:"2.7rem"}}><BiArrowFromLeft size={35} color={this.state.hover2 ? "white" : "black"}/></i>
                </div>
                </Link>
                )}
                {this.state.isSignedIn && (
                    <Link to={"/saved-history"} style={{textDecoration:"none", color:"black", fontFamily:"'PT Sans', sans-serif"}}>
                    <div className="functionality-3"onMouseEnter={()=>this.setState({hover3:true})} onMouseLeave={()=>this.setState({hover3:false})}>
                        <p style={{width:"40rem", marginBottom:"-0.5rem", marginTop:"-0.5rem"}}><h5><strong>Access Your Saved Articles</strong></h5>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rhoncus bibendum leo a tincidunt. In non est et quam tristique pulvinar vitae sit amet elit. Ut bibendum libero sem, at viverra quam malesuada eu. Nunc sit amet nulla consectetur enim vehicula volutpat. Sed justo orci, blandit et eleifend ut, convallis non lorem.
                        </p>
                        <i className="home-icon" style={{marginLeft: "3rem", marginTop:"2.3rem"}}><BiArrowFromLeft size={35} color={this.state.hover3 ? "white" : "black"}/></i>
                    </div>
                    </Link>
                )}
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

export default connect(map)(Home);