import {SET_SCREAMS, LIKE_SCREAM, UNLIKE_SCREAM, LOADING_DATA, DELETE_SCREAM, POST_SCREAM,SET_SCREAM, SUBMIT_COMMENT} from '../types'

const initialState = {
    screams: [],
    scream: {},
    loading: false
};


export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return{
                ...state,
                loading: true
            }
        case SET_SCREAMS:
            return{
                ...state,
                screams: action.payload,
                loading: false
            }
        case UNLIKE_SCREAM:
        case LIKE_SCREAM:
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;
            if(state.scream.screamId === action.payload.screamId){
                state.scream = action.payload
            }
            return{
                ...state
            }
        case DELETE_SCREAM:
            let dIndex = state.screams.findIndex((scream) => scream.screamId === action.payload);
            state.screams.splice(dIndex,1);
            return {
                ...state
            }
        case POST_SCREAM:
            return {
                ...state,
                screams:[
                    action.payload,
                    ...state.screams
                ]
            }
        case SET_SCREAM:
            return{
                ...state,
                scream: action.payload
            }
        case SUBMIT_COMMENT:
            return{
                ...state,
                scream:{
                    ...state.scream,
                    comments: [action.payload, ...state.scream.comments]
                }
            }
        default:
            return{
                ...state
            }
    }
} 