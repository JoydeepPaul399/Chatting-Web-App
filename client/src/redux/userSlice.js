import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    name: "",
    email: "",
    profile_pic: "",
    token: "",
    _id: "",
    onlineUser: [],
    // we will use the socket connection we build in Home.js file 
    socketConnection: null
}

export const userSlice= createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action)=>{
            state.name= action.payload.name
            state.email= action.payload.email
            state._id= action.payload._id
            state.profile_pic= action.payload.profile_pic
        },
        setToken: (state, action)=>{
            state.token= action.payload
        },

        updateUserDetails: (state, action)=> {
            state.name= action.payload.name
            state.profile_pic= action.payload.profile_pic
        },

        logout: (state, action)=>{
            state.name= ""
            state.email= ""
            state._id= ""
            state.profile_pic= ""
            state.token= ""
            state.socketConnection=null
        },
        setOnlineUser: (state, action)=>{
            state.onlineUser= action.payload
        },
        setSocketConnection: (state, action)=>{
            // console.log("socket connection is ", action.payload)
            state.socketConnection= action.payload
        }
    }
})

export const {setUser, setToken, logout, updateUserDetails, setOnlineUser, setSocketConnection }= userSlice.actions
export default userSlice.reducer