import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import "../styles.css";
import {AiOutlineSearch} from "react-icons/ai"
import {RiArrowGoBackLine} from "react-icons/ri"
import { motion } from "framer-motion";
import {connect} from "react-redux";
import { IconContext } from "react-icons";

import {saveSearchedArticle} from "../redux-actions/auth";

const containerStyle = {
    position: "absolute",
    margin: "24rem",
    top: "-1rem",
    left: "34.4rem",
    width: "3rem",
    height: "3rem",
    boxSizing: "border-box"
};
  
const circleStyle = {
    display: "block",
    width: "3rem",
    height: "3rem",
    border: "0.3rem solid #e9e9e9",
    borderTop: "0.3rem solid #3498db",
    borderRadius: "50%",
    position: "absolute",
    boxSizing: "border-box",
    top: 0,
    left: 0
};
  
const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1
};


class ArticleSearch extends Component{
    constructor(props){
        super(props);

        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleSaveArticle = this.handleSaveArticle.bind(this);
        this.handleUrlInput = this.handleUrlInput.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            url: "",
            censored_texts: [],
            uncensored_texts: [],
            article:[],
            success: false,
            loading: false,
            searchicon: true,
            nourl: false,
            loaded: false,
            saved: false,
            isSignedIn: false,
            showAnalysis: false,
            censored: true,
            checked: false,
            nlp_censored_texts: [],
        }
    }

    handleUrlInput(input){
        this.setState({
            url: input.target.value,
        });
        if(input.target.value===""){
            this.setState({
                searchicon: true,
            });
        }
        else{
            this.setState({
                searchicon:false,
            });
        }
    }

    handleGoBack(input){
        input.preventDefault()

        window.location.reload()
    }

    handleSearch(input){
        input.preventDefault();
        const url = {'url':this.state.url};
        
        const {user:currUser} = this.props;

        if(this.state.url===""){
            this.setState({
                nourl: true,
            });
        }
        else{
        this.setState({
            success: true,
            loading: true,
            nourl: false,
        });

        this.form.validateAll();

        //Uses fetch to send article url to the Flask back-end and retrieve Flask output data 
        fetch("http://localhost:5000/article-parser", {method:'POST', body: JSON.stringify(url)}).then((res) => res.json())
        .then(
                //Textual and analystical data recieved from the Flask back-end
                data =>{
                    this.setState({
                        article: data.article,
                        censored_texts: data.article.censored_text,
                        uncensored_texts: data.article.uncensored_text,
                        //Censored by word replacement text recieved from the Flask back-end
                        nlp_censored_texts: data.article.nlp_censored_text,
                        loading: false,
                        loaded: true,
                    });
                    if(currUser){
                        this.setState({
                            isSignedIn: true,
                        });
                    }
                    else{
                        this.setState({
                            isSignedIn: false,
                        });
                    }
                }
            );
        }
    }

    handleSaveArticle(input){
        input.preventDefault();

        const {user:currUser} = this.props;
    
        this.props.dispatch(saveSearchedArticle(currUser.email, this.state.article.title, this.state.url))
        .then(() => {
            this.setState({
                saved: true,
            });
        })
        .catch(() => {
            this.setState({
                saved: false,
            });
        });
    }

    render(){
        const {article, censored_texts, uncensored_texts, nlp_censored_texts} = this.state;

        return(
            <div className="main-image" style={{paddingTop:"5rem"}}>
                
                { !this.state.success && (
                    <Form onSubmit = {this.handleSearch} 
                    ref = {(e) => {
                        this.form = e;
                    }}
                    >
                        <div className="container-form text-center" style={{marginTop: "20rem"}}>
                            <div className="form-group">
                                {this.state.searchicon &&(
                                    <i className="search-icon"><AiOutlineSearch/></i>
                                )}
                                <label htmlFor="search" className="label"><h4>Search for an Article:</h4></label>
                                <Input type="text" 
                                style={{width:"60rem", marginLeft:"30rem", backgroundColor:"#E4E4E4",borderRadius:"15px",outline:"1px solid grey"}}
                                placeholder="Insert article URL here"
                                className="form-control text-center"
                                name="url" 
                                value={this.state.url} 
                                onChange={this.handleUrlInput}/>
                                {this.state.nourl && (
                                    <div className="alert alert-danger text-center" role="alert" style={{width:"20rem", marginLeft:"50rem", marginTop:"5px", padding:"10px"}}>
                                        No URL was provided
                                    </div>
                                )}
                            </div>
                            <div className="form-group text-center">
                                <button className="btn btn-primary btn-block" style={{borderRadius:"10px", backgroundColor:"#145364", border: "none"}}>Find</button>
                            </div>
                        </div>
                    </Form>
                )}

                {this.state.loading &&(
                    <div style={containerStyle} className="loading-circle text-center">
                        <motion.span style={circleStyle} animate={{ rotate: 360 }} transition={spinTransition}/>
                    </div>
                )}
                {this.state.loaded && (
                    <div className="go-back-container">
                    <IconContext.Provider value={{size:"2.1rem", color:"white"}}>
                        <i className="go-back" onClick={this.handleGoBack}><RiArrowGoBackLine/></i>
                    </IconContext.Provider>
                    </div>
                )}
                <div style={{marginTop:"-6rem"}}>
                {this.state.loaded && (
                    <div className="form-group one text-center">
                        {this.state.isSignedIn && (
                        <button className="btn btn-primary btn-block" disabled={this.state.saved} onClick={this.handleSaveArticle} style={this.state.saved ? {borderRadius:"10px", backgroundColor:"rgb(142, 189, 124)", border: "none"}:{borderRadius:"10px", backgroundColor:"#145364", border: "none"}}>{this.state.saved ? "Article Saved" : "Save Article"}</button>
                        )}
                        <button className="btn btn-primary btn-block" style={this.state.showAnalysis ? {marginLeft:"1rem", borderRadius:"10px", backgroundColor:"rgb(142, 189, 124)", border: "none"} : {marginLeft:"1rem", borderRadius:"10px", backgroundColor:"#145364", border: "none"}} onClick={()=> this.setState({showAnalysis: !this.state.showAnalysis})}>Analyse Text</button>
                        <button className="btn btn-primary btn-block" style={this.state.censored ? {marginLeft:"1rem", borderRadius:"10px", backgroundColor:"rgb(142, 189, 124)", border: "none"}:{marginLeft:"1rem", borderRadius:"10px", backgroundColor:"#145364", border: "none"}} onClick={() => this.setState({censored: !this.state.censored})}>{this.state.censored ? "Uncensor" : "Censor"}</button>
                        <button className="btn btn-primary btn-block" style={this.state.checked ? {marginLeft:"1rem", border:"none", backgroundColor:"red"}:{marginLeft:"1rem", border:"none", backgroundColor:"transparent", width:"10rem"}} onClick={()=>this.setState({checked: !this.state.checked})}>Word replacement</button> 
                    </div>
                )}

                {this.state.showAnalysis && (
                    <div className="text-center">
                        <p><strong>Word count:</strong> &nbsp; {article.word_len} &nbsp;&nbsp; | &nbsp;&nbsp; <strong>Num of Profane words:</strong> &nbsp; {article.profane_words_len} &nbsp;&nbsp; | &nbsp;&nbsp; <strong>Average sentence length:</strong> &nbsp; {article.avg_sentence_len} &nbsp;&nbsp; | &nbsp;&nbsp; <strong>% profane:</strong> &nbsp; {article.scale}%</p>
                    </div>
                )}
                {this.state.loaded&&this.state.censored && (
                <div className="container-article" style={{marginLeft:"20.5rem"}}>
                    <div className="container-text">

                        {this.state.loaded && (
                            <h3 style={{padding:"2rem", textAlign:"center"}}>{article.title}</h3>
                        )}
                        {this.state.checked ? (
                        <div>
                        {nlp_censored_texts.map((text,i)=>{
                            return(
                                <div key={i} className="text-left">
                                    <p>{text}</p>
                                </div>
                            );
                            })}
                        </div>
                        ):(
                            <div>
                                {censored_texts.map((text,i)=>{
                            return(
                                <div key={i} className="text-left">
                                    <p>{text}</p>
                                </div>
                            );
                            })}
                            </div>
                        )}
                    </div>
                </div>
                )}
                
                {this.state.loaded&&!this.state.censored &&(
                    <div className="container-article" style={{marginLeft:"20.5rem"}}>
                    <div className="container-text">

                        {this.state.loaded && (
                            <h3 style={{padding:"2rem", textAlign:"center"}}>{article.title}</h3>
                        )}
                            
                        {uncensored_texts.map((text,i)=>{
                            return(
                                <div key={i} className="text-left">
                                    <p>{text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}
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

export default connect(map)(ArticleSearch);