const express= require('express')
const registerUser = require('../controller/registerUserModel')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/SearchUser')

const router= express.Router()

// Create User API 
router.post('/register', registerUser)
// Check user email 
router.post('/email', checkEmail)
// Check user password. (login)
router.post('/password', checkPassword)
// Login user details
router.get("/user-details", userDetails)
// Logout api
router.get("/logout", logout)
// Update user details
router.post("/update-user", updateUserDetails)
// search user 
router.post("/search-user", searchUser)

module.exports= router