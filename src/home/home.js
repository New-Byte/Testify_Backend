// Route to display data on home page
const express = require("express")
const auth = require("../../middleware/auth")
const UserSchema = require('../../models/user')

const app = express()

app.post("/authentication/login", auth, async (req, res) => {
    try{
        const {
            
        } = req.body

    } catch(error){
        console.log('ERROR: ' + error)
        res.status('203').json({
            success: 0,
            msg: 'Something went wrong!'
        })
    }
})

module.exports = app
