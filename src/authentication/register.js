// register the user
// importing user context
const express = require("express")
const bcrypt = require("bcryptjs")
const UserSchema = require('../../models/user')

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
      const access = {
        tabs: ['Users'],
        set_preferences: true
      }
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