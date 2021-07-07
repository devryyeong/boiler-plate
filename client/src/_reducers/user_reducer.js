import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
        
        case REGISTER_USER:
            return {...state, register: action.payload }
            break;
        
        case AUTH_USER:
            return {...state, userData: action.payload }
            break;
        
        default:
            return state;
    }
}

//action.payload: back-end에서 오는 user data가 여기에 들어있음.