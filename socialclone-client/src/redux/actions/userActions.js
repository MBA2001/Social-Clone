import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER, MARK_NOTIFICATIONS_READ} from '../types';
import axios from 'axios';

export const loginUser = (userData,history) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post('/login', userData)
            .then(res => {
                setAuth(res.data.token)
                dispatch(getUserData());
                dispatch({type: CLEAR_ERRORS});
                history.push('/')
            })
            .catch(err => {
                dispatch({
                    type:SET_ERRORS,
                    payload: err.response.data
                })
            })
}

export const signUpUser = (newUserData,history) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post('/signup', newUserData)
            .then(res => {
                setAuth(res.data.token)
                dispatch(getUserData());
                dispatch({type: CLEAR_ERRORS});
                history.push('/')
            })
            .catch(err => {
                dispatch({
                    type:SET_ERRORS,
                    payload: err.response.data
                })
            })
}

export const logOutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['authorization'];
    dispatch({type: SET_UNAUTHENTICATED})
}

export const getUserData = () => (dispatch) => {
    dispatch({type: LOADING_USER})
    axios.get('/user')
        .then(res => {
            dispatch({
                type:SET_USER,
                payload:res.data
            })
        })
        .catch(err => console.log(err))
}

export const uploadImage = (formdata) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post('/user/image', formdata)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
}

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post('/user',userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
}

export const markNotificationsRead = (notificationIds) => dispatch => {
    axios.post('/notifications', notificationIds)
        .then(res => {
            dispatch({type: MARK_NOTIFICATIONS_READ});
        })
        .catch(err => console.error(err));
}


const setAuth = (token) => {
    const FBtoken = `Bearer ${token}`
    localStorage.setItem('FBIdToken',FBtoken)
    axios.defaults.headers.common['authorization'] = FBtoken
}


