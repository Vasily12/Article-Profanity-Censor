import React, {Component} from "react";
import {connect} from "react-redux";
import userService from "../services/userService";
import "../styles.css";
import { IconContext } from "react-icons";
import {RiArrowGoBackLine} from "react-icons/ri"
import { motion } from "framer-motion";



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

class ArticleHistory extends Component{
    constructor(props){
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleViewArticle = this.handleViewArticle.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleCompareArticles = this.handleCompareArticles.bind(this);

        this.state = {
            articles:[],
            censored_texts: [],
            uncesored_texts: [],
            article: [],
            article1: {},
            article2: {},
            loading: false,
            loaded: false,
            success: false,
            url_value1: "",
            url_value2: "",
            max: false,
            curr: 0,
            comparison: false,
            showAnalysis: false,
            censored: true,
            notEmpty: false,
        }
    }

    handleOnClick(input){

        if(this.state.curr===0){
            this.setState({
                url_value1: input.target.value,
                curr: this.state.curr+1,
            });
        }
        else if(this.state.curr===1&&this.state.url_value1===""){
            if(this.state.url_value2===input.target.value){
                this.setState({
                    url_value2: "",
                    curr: this.state.curr-1,
                });
            }
            else{
                this.setState({
                    url_value1: input.target.value,
                    curr: this.state.curr+1,
                    max: true,
                });
            }
        }
        else if(this.state.curr===1&&this.state.url_value2===""){
            if(this.state.url_value1===input.target.value){
                this.setState({
                    url_value1: "",
                    curr: this.state.curr-1,
                });
            }
            else{
                this.setState({
                    url_value2: input.target.value,
                    curr: this.state.curr+1,
                    max: true,
                });
            }
        }
        else if(this.state.curr===2){
            if(this.state.url_value1===input.target.value){
                this.setState({
                    url_value1: "",
                    curr: this.state.curr-1,
                    max: false,
                });
            }
            if(this.state.url_value2===input.target.value){
                this.setState({
                    url_value2: "",
                    curr: this.state.curr-1,
                    max: false,
                });
            }
            
        }
    }

    handleGoBack(input){
        input.preventDefault();

        window.location.reload();
    }

    handleDelete(input){

        input.preventDefault();

        const {user:currUser} = this.props;

        userService.deleteSavedArticle(currUser.email, input.target.value)
        .then(()=>{
            window.location.reload();
        },
        (err) => {
            this.setState({
                content: (err.res && err.res.data && err.res.data.message)||err.message||err.toString()
            });
        });
    }

    componentDidMount(){

        const {user:currUser} = this.props;

        userService.loadSavedArticles(currUser.email)
        .then(res=>{
            this.setState({
                articles: res.data,
            });
            if(this.state.articles===[]){
                this.setState({
                    notEmpty:false,
                });
            }
            else{
                this.setState({
                    notEmpty:true,
                });
            }
        },
        err => {
            this.setState({
                content: (err.res && err.res.data && err.res.data.message)||err.message||err.toString()
            });
        });
    }

    handleViewArticle(input){
        input.preventDefault();
        
        const url = {'url':input.target.value};

        this.setState({
            loading: true,
            success: true,
        });

        fetch("http://localhost:5000/article-parser", {method:'POST', body: JSON.stringify(url)}).then((res) => res.json())
        .then(
            data =>{
                this.setState({
                    article: data.article,
                    censored_texts: data.article.censored_text,
                    uncensored_texts: data.article.uncensored_text,
                    loading: false,
                    loaded: true,
                });
            }
        );
    }

    handleCompareArticles(input){
        input.preventDefault();

        const urls = {'url1':this.state.url_value1, 'url2':this.state.url_value2}

        this.setState({
            loading: true,
            success: true,
            comparison: true,
        });

        fetch("http://localhost:5000/compare_articles", {method:'POST', body: JSON.stringify(urls)}).then((res) => res.json())
        .then(
            data => {
                this.setState({
                    article1: data.article1,
                    article2: data.article2,
                    loaded: true,
                    loading: false,

                });
            }
        );
    }

    render(){

        const {articles, censored_texts, uncensored_texts, article1, article2, article} = this.state;

        return(
            <div className="main-image" style={{paddingTop:"5rem"}}>
                {!this.state.success &&(
                    <div>
                        <div className="container-save text-center">
                            <h1><strong>Your Saved Articles</strong></h1>
                            <p style={{width:"40rem",marginTop:"1rem", marginLeft:"40rem"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                        {this.state.notEmpty ? (
                        <div className="articles-container">
                            <div className="compare-container text-center">
                                <button className="compare-button-function" onClick={this.handleCompareArticles} style={this.state.max ? {backgroundColor:"rgb(71, 124, 88)"}:{backgroundColor:"lightgrey", transform:"scale(0.75)", outline:"none", border:"none", color:"black"}} disabled={this.state.max ? false : true}>{this.state.max ? "Compare Selected Articles" : "Select Articles to Compare"}</button>
                            </div>
                            {articles.map((article, i) => {
                                return (
                                    <div key={i} className="container-saved-article">
                                        <h6 className="title">{i + 1}. {article.title}</h6>
                                        {(!this.state.max|| this.state.url_value1===article.url||this.state.url_value2===article.url) && (     
                                            <button className="compare-button" onClick={this.handleOnClick} value={article.url} style={this.state.url_value1===article.url||this.state.url_value2===article.url ? {backgroundColor: "rgb(71, 124, 88)", color: "white"} :{}}>Compare</button>
                                        )}
                                        <button className="view-article" onClick={this.handleViewArticle} style={this.state.max&&(this.state.url_value1!==article.url&&this.state.url_value2!==article.url) ? {marginLeft:"50.26rem"}:{}} value={article.url}>View</button>
                                        <button className="get-link"><a className="link" href={article.url}>Web-Link</a></button>
                                        <button onClick={this.handleDelete} value={article.title} className="delete-link">Delete</button>
                                    </div>
                                );
                            })}
                        </div>
                        ):(
                            <div className="articles-container text-center" style={{paddingTop:"1rem"}}>
                                <p>No articles found...</p>
                            </div>
                        )}
                    </div>
                )}

                {this.state.loading &&(
                    <div style={containerStyle} className="loading-circle text-center">
                        <motion.span style={circleStyle} animate={{ rotate: 360 }} transition={spinTransition}/>
                    </div>
                )}

                {this.state.loaded && (
                    <div className="go-back-container">
                        <IconContext.Provider value={{size:"2.1rem", color:"white"}}>
                            <i className="go-back" onClick={this.handleGoBack} style={{top: "5.3rem"}}><RiArrowGoBackLine/></i>
                        </IconContext.Provider>
                    </div>
                )}

                {!this.state.comparison ? (
                    <div style={{marginTop:"-4rem"}}>
                        {this.state.loaded && (
                            <div className="text-center">
                                <button className="btn btn-primary btn-block new" style={this.state.showAnalysis ? {marginLeft:"1rem", borderRadius:"10px", backgroundColor:"rgb(142, 189, 124)", border: "none"}:{marginLeft:"1rem", borderRadius:"10px", backgroundColor:"#145364", border: "none"}} onClick={()=> this.setState({showAnalysis: !this.state.showAnalysis})}>Analyse Text</button>
                                <button className="btn btn-primary btn-block new" style={this.state.censored ? {marginLeft:"1rem", borderRadius:"10px", backgroundColor:"rgb(142, 189, 124)", border: "none"}:{marginLeft:"1rem", borderRadius:"10px", backgroundColor:"#145364", border: "none"}} onClick={() => this.setState({censored: !this.state.censored})}>{this.state.censored ? "Uncensor" : "Censor"}</button>
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
                            
                                {censored_texts.map((text,i)=>{
                                    return(
                                        <div key={i} className="text-left">
                                            <p>{text}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        )}
                        {this.state.loaded&&!this.state.censored && (
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
                ):(
                    <div>
                        {this.state.loaded && (
                            <div className="comparison-container">
                                <div className="metrics-container">
                                    <div className="article1-metrics-container text-center">
                                        <div className="compared-articles-title-container text-center">
                                            <h5 className="article-title1"><strong>{article1.title}</strong></h5>
                                        </div>
                                        <hr style={{width:"15rem", marginLeft:"7.5rem", marginTop:"3rem", height:"1px"}}/>
                                        <h6 className="metric-item1">{article1.word_len} (words)</h6>
                                        <h6 className="metric-item1">{article1.profane_words_num} (words)</h6>
                                        <h6 className="metric-item1">{article1.scale} (%)</h6>
                                        <h6 className="metric-item1">{article1.avg_sentence_len} (words/sentence)</h6>
                                        <hr style={{width:"15rem", marginLeft:"7.5rem", marginTop:"1.5rem", height:"1px"}}/>
                                    </div>
                                    <div className="metric-type-container text-center">
                                        <h6 className="metric-item">-: Word Count :-</h6>
                                        <hr style={{margin:"0", padding:"0", width:"30px", marginLeft:"4.9rem"}}/>
                                        <h6 className="metric-item">-: Profane word count :-</h6>
                                        <hr style={{margin:"0", padding:"0", width:"30px", marginLeft:"4.9rem"}}/>
                                        <h6 className="metric-item">-: % Profane :-</h6>
                                        <hr style={{margin:"0", padding:"0", width:"30px", marginLeft:"4.9rem"}}/>
                                        <h6 className="metric-item">-: Avg. sentence length :-</h6>
                                    </div>
                                    <div className="article2-metrics-container text-center">
                                        <div className="compared-articles-title-container text-center">
                                            <h5 className="article-title2"><strong>{article2.title}</strong></h5>
                                        </div>
                                        <hr style={{width:"15rem", marginLeft:"7.5rem", marginTop:"3rem", height:"1px"}}/>
                                        <h6 className="metric-item2">{article2.word_len} (words)</h6>
                                        <h6 className="metric-item2">{article2.profane_words_num} (words)</h6>
                                        <h6 className="metric-item2">{article2.scale} (%)</h6>
                                        <h6 className="metric-item2">{article2.avg_sentence_len} (words/sentence)</h6>
                                        <hr style={{width:"15rem", marginLeft:"7.5rem", marginTop:"1.5rem", height:"1px"}}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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

export default connect(map)(ArticleHistory);