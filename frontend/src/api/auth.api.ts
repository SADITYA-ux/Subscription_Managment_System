import apiRequest from "./apiClient";

export function loginUser( email : string , password : string )
{
    return apiRequest("auth/login" , "POST" , { email , password });
}

export function registerUser( data : {
    email : string,
    password : string,
    name : string,
    address : string,
    number : Number,
    age : Number
})
{
    return apiRequest("auth/register" , "POST" , data);
}