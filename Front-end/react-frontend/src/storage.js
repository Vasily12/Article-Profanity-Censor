import { createStore, applyMiddleware } from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import reduxReducers from "./redux-reducers";

const middleware = [thunk];

const storage = createStore(
    reduxReducers,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default storage;