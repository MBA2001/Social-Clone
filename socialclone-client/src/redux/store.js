import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import UIReducer from './reducers/UIReducer';


const initialState = {};

const middleware  = [thunk];

const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: UIReducer
})

const store = createStore(reducers,
    initialState,
    composeWithDevTools(
        applyMiddleware(...middleware)
    ));

    
export default store;