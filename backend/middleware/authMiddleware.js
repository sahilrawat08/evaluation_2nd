const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req , res , next ) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            // verify token
            const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
            
            // Get user from token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log("Middleware protection error : " , error)
            res.status(401)
            throw new Error('Not Authorised')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not Authorised , no token')
    }
}) 

module.exports = { protect }