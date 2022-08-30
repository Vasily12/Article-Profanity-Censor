import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";

import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import Home from "./components/Home";
import UserProfile from "./components/userProfile";
import { clearMessage } from "./redux-actions/message";
import { signout } from "./redux-actions/auth";
import { history } from "./history";
import ArticleSearch from "./components/ArticleSearch";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import EmailChange from "./components/EmailChange";
import PassChange from "./components/PassChange";
import ArticleHistory from "./components/ArticleHistory";
import { BsBoxArrowRight } from "react-icons/bs";

import AC from "./AC.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);

    this.state = {
      currUser: undefined,
      data: "",
      chosen1: false,
      chosen2: false,
      chosen3: false,
      chosen4: false,
      chosen5: false,
      chosen6: false,
    };

    history.listen((location) => {
      props.dispatch(clearMessage());
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currUser: user,
      });
    }
  }

  signOut() {
    this.props.dispatch(signout());
    this.setState({
      currUser: undefined,
    });
  }

  render() {
    const { currUser } = this.state;

    return (
      <BrowserRouter history={history}>
        <div>
          <nav className="navbar navbar-expand">
            <div className="container-fluid">
              <Link
                to={"/"}
                className="navbar-brand"
                onClick={() =>
                  this.setState({
                    chosen1: true,
                    chosen2: false,
                    chosen3: false,
                    chosen4: false,
                    chosen5: false,
                    chosen6: false,
                  })
                }
              >
                <img
                  src={AC}
                  alt="AC"
                  style={{
                    width: "10rem",
                    paddingBottom: "-20px",
                    marginTop: "5px",
                    marginLeft: "-10px",
                  }}
                ></img>
              </Link>

              <div className="navbar-nav me-auto">
                <li
                  className="nav-item"
                  onClick={() =>
                    this.setState({
                      chosen1: true,
                      chosen2: false,
                      chosen3: false,
                      chosen4: false,
                      chosen5: false,
                      chosen6: false,
                    })
                  }
                >
                  <Link
                    to={"/home"}
                    className="nav-link link"
                    style={
                      this.state.chosen1
                        ? { color: "#145364", outline: "1px solid #145364" }
                        : {}
                    }
                  >
                    Home
                  </Link>
                </li>

                <li
                  className="nav-item"
                  onClick={() =>
                    this.setState({
                      chosen1: false,
                      chosen2: true,
                      chosen3: false,
                      chosen4: false,
                      chosen5: false,
                      chosen6: false,
                    })
                  }
                >
                  <Link
                    to={"/search/article"}
                    className="nav-link link"
                    style={
                      this.state.chosen2
                        ? { color: "#145364", outline: "1px solid #145364" }
                        : {}
                    }
                  >
                    Article Search
                  </Link>
                </li>

                {currUser && (
                  <li
                    className="nav-item"
                    onClick={() =>
                      this.setState({
                        chosen1: false,
                        chosen2: false,
                        chosen3: true,
                        chosen4: false,
                        chosen5: false,
                        chosen6: false,
                      })
                    }
                  >
                    <Link
                      to={"/saved-history"}
                      className="nav-link link"
                      style={
                        this.state.chosen3
                          ? { color: "#145364", outline: "1px solid #145364" }
                          : {}
                      }
                    >
                      Saved Articles
                    </Link>
                  </li>
                )}
              </div>

              {currUser ? (
                <div className="navbar-nav ml-auto">
                  <li
                    className="nav-item"
                    onClick={() =>
                      this.setState({
                        chosen1: false,
                        chosen2: false,
                        chosen3: false,
                        chosen4: true,
                        chosen5: false,
                        chosen6: false,
                      })
                    }
                  >
                    <Link
                      to={"/profile"}
                      className="nav-link link"
                      style={
                        this.state.chosen4
                          ? { color: "#145364", outline: "1px solid #145364" }
                          : {}
                      }
                    >
                      {currUser.username}
                    </Link>
                  </li>

                  <li>
                    <a
                      href="/signin"
                      className="nav-item last"
                      onClick={this.signOut}
                    >
                      <i
                        style={{ marginTop: "-0.3rem", marginRight: "2rem" }}
                        className="nav-link last-item"
                      >
                        <BsBoxArrowRight size={40} />
                      </i>
                    </a>
                  </li>
                </div>
              ) : (
                <div className="navbar-nav ml-auto">
                  <li
                    className="nav-item"
                    onClick={() =>
                      this.setState({
                        chosen1: false,
                        chosen2: false,
                        chosen3: false,
                        chosen4: false,
                        chosen5: true,
                        chosen6: false,
                      })
                    }
                  >
                    <Link
                      to={"/signin"}
                      className="nav-link link"
                      style={
                        this.state.chosen5
                          ? { color: "#145364", outline: "1px solid #145364" }
                          : {}
                      }
                    >
                      Sign In
                    </Link>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() =>
                      this.setState({
                        chosen1: false,
                        chosen2: false,
                        chosen3: false,
                        chosen4: false,
                        chosen5: false,
                        chosen6: true,
                      })
                    }
                  >
                    <Link
                      to={"/signup"}
                      className="nav-link link last"
                      style={
                        this.state.chosen6
                          ? { color: "#145364", outline: "1px solid #145364" }
                          : {}
                      }
                    >
                      Sign Up
                    </Link>
                  </li>
                </div>
              )}
            </div>
          </nav>

          <div className="container mt-3">
            <Routes>
              <Route path={"/"} element={<Home />} />
              <Route path={"/home"} element={<Home />} />
              <Route path={"/signup"} element={<SignUp />} />
              <Route path={"/signin"} element={<SignIn />} />
              <Route path={"/profile"} element={<UserProfile />} />
              <Route path={"/change/email"} element={<EmailChange />} />
              <Route path={"/change/password"} element={<PassChange />} />
              <Route path={"/search/article"} element={<ArticleSearch />} />
              <Route path={"/saved-history"} element={<ArticleHistory />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

function map(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(map)(App);
