// Route to log user in
// importing user context
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const UserSchema = require('../../models/user')
const sessionSchema = require('../../models/session')

const app = express()

// Login
app.post("/authentication/login", async (req, res) => {
  try {
    const {
      username,
      user_password
    } = req.body

    // Validate user input
    if (!(username && user_password)) {
      return res.status(203).json({
        success: 0,
        msg: "All inputs are required"
      })
    }

    // Validate if user exists in our database
    const user1 = await UserSchema.findOne({
        username
    })

    if (!user1) {
      return res.status(203).json({
        success: 0,
        msg: "User is not registered"
      })
    }

    var matchPassword = bcrypt.compareSync(user_password, user1.user_password)

    if (user1 && matchPassword) {

      var user_id = user1._id

      const token = jwt.sign({
        user_id
      },
      process.env.TOKEN_KEY, {
        expiresIn: "7d",
      }
      )

      // check if session exists for user

      const sess = await sessionSchema.findOne({
        user_id: user_id
      })

      if (!sess) {
        // save user token
        const session1Ignored = await sessionSchema.create({
          user_id: user_id,
          jwt_token: token
        })

      } else {
        const date = Date.now()
        const update_sessIgnored = await sessionSchema.updateOne({
          user_id: user_id
        }, {
          last_requested_at: date
        })

      }

      //set cookie as encoded token
      let users_data = {
        token: token
      }
      res.cookie("userData", users_data, {
        httpOnly: false,
        maxAge: 259200000,
        domain: process.env.domain
      })

      return res.status(200).json({
        success: 1,
        msg: "Logged in successfully",
        data: {
          user: username,
          user_full_name: user1.user_full_name,
          user_role: user1.user_role,
          access: user1.access,
          user_profile_image: user1.user_profile_image
        }
      })
    }
    return res.status(203).json({
      success: 0,
      msg: "Invalid Credentials"
    })
  } catch (err) {
    console.log(err)
    return res.status(203).json({
      success: 0,
      msg: 'Something went wrong!'
    })
  }
})

module.exports = app