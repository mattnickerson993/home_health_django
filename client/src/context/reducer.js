import { getUser } from "../services/authService"
import { setLocalStorage } from "../utils/storage"

export const initialState = {
    userDetails: "",
    isAuthenticated: false,
    errorMessage:"",
    loading:false,
}

export const AuthReducer = (state, action ) => {
    switch(action.type){
        case "LOGIN_SUCCESS":{
            setLocalStorage(action.payload)
            return {
                ...state,
                userDetails: getUser(),
                isAuthenticated: true,
                    
            }
        }
        case "USER_LOADED_SUCCESS":
            return{
                ...state,
                userDetails: action.payload,
            }
        case "USER_LOADED_FAIL":
            return{
                ...state,
                userDetails: null 
            }
        
        case "LOGOUT":
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: false,
                userDetails:null,
                
            }
    
        case "LOGIN_FAIL":{
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: false,
                errorMessage:action.payload.errorMessage
                
            }
        }
    
        case "AUTHENTICATED_SUCCESS":{
            return{
                ...state,
                userDetails: getUser(),
                isAuthenticated: true,
            }
        }
    
        case "AUTHENTICATED_FAIL":{
           return {
            ...state,
            isAuthenticated: false,
           } 
        }
    
        case "PASSWORD_RESET_SUCCESS":{
            return{
                ...state,
            }
        }
    
        case "PASSWORD_RESET_FAIL":{
            return{
                ...state,
            }
        }
    
        case "PASSWORD_RESET_CONFIRM_SUCCESS":{
            return{
                ...state,
            }
        }
    
        case "PASSWORD_RESET_CONFIRM_FAIL":{
            return{
                ...state,
            }
        }
    
        case "SIGNUP_SUCCESS":{
            return {
                ...state,
                isAuthenticated: false,
            }
        }
    
        case "SIGNUP_FAIL":{
            return {
                ...state,
                errorMessage:action.payload.errorMessage
            }
        }
    
        case "ACTIVATION_SUCCESS":{
            return {
                ...state
            }
        }
    
        case "ACTIVATION_FAIL":{
            return {
                ...state
            }
        }

        case "UPDATE_ACCESS":{
            return {
                ...state,
            }
        }
        case "RESET_ERROR":{
            return {
                ...state,
                errorMessage:""
            }
        }
        case "MESSAGE_CLEAR":{
            return {
                ...state,
            }
        }
    
        default:{
            return state
        }
    }
    
}