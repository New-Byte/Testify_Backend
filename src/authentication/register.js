// register the user
// importing user context
const express = require("express")
const bcrypt = require("bcryptjs")
const UserSchema = require('../../models/user')
const email = require('../common_api/sendemail')
const { exists } = require("../../models/user")

const app = express()

app.post("/authentication/register", async (req, res) => {
  try {
    // Get user input
    var {
      user_full_name,
      user_email_id,
      username,
      user_password,
      user_role,
      user_profile_image
    } = req.body

    // Validate user input
    if (!(user_email_id && username && user_password)) {
      return res.status(203).json({
        success: 0,
        msg: "Please fill all the details"
      })
    }

    //if image is not provided set a default one.
    if (!user_profile_image) {
      user_profile_image = "53c2eeba061f43c00c2478cc"
    }

    // Validate if user exist in our database
    const oldUser = await UserSchema.findOne({
      username
    })
    if (oldUser) {
      return res.status(203).json({
        success: 0,
        msg: "User already exists. Please Login"
      })
    }

    // encrypt user password

    const salt = bcrypt.genSaltSync(10)
    user_password = bcrypt.hashSync(user_password, salt)

    if(user_role=='admin'){
      var message = "<h1>Welcome, "+user1.user_full_name + "</h1> <b style='font-family:sans-seriff;font-size: 18px; color: green'>You made the right choice!!!</b><br/>We welcome you to our family as an admin. You are an important member already...\n You are the one who keeps intruders away and everyone at bay.. :). We welcome you and your desciplined co-ordination!!! <br/><br/>Yours Truly,<br/>The Testify Family."
      const access = {
        tabs: ['Home','Users', 'Settings'],
        set_preferences: true
      }
    } else if(user_role=='teacher'){
      var message = "<img src='../common_api/logo123.png'><br/><h1>Welcome, "+user1.user_full_name + "</h1> <b style='font-family:sans-seriff;font-size: 18px; color: green'>You made the right choice!!!</b><br/>We welcome you to our family as a Teacher. You are an important member already...\n You have the responsibility to craft the future of our country and we welcome you to the mission!<br/><br/>Yours Truly,<br/>The Testify Family."
    } else if(user_role=='student'){
      var message = "<h1>Welcome, "+user1.user_full_name + "</h1> <b style='font-family:sans-seriff;font-size: 18px; color: green'>You made the right choice!!!</b><br/>We welcome you to our family as a Student. You are an important member already...\n You are the future and your future is secure with us....<br/><br/>Yours Truly,<br/>The Testify Family."
    } else {
      return res.status('203').json({
        status: 0,
        msg: "User role doesn't exist."
      })
    }

    // Create user in our database
    var user1 = await UserSchema.create({
      user_full_name: user_full_name,
      user_email_id: user_email_id,
      username: username,
      user_password: user_password,
      user_profile_image: user_profile_image,
      user_role: user_role,
      access: access
    })

    if (user1) {
      email(user1.user_email_id, 'Welcome to Testify!', message)
      // return new user
      return res.status(200).json({
        success: 1,
        msg: "User created successfully"
      })
    }
  } catch (error) {
    console.log(error)
    res.status(203).json({
      success: 0,
      msg: "Something Went wrong!"

    })
  }
})

module.exports = app