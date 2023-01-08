// Forgot password logic
// importing user context
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const sendemail = require("../common_api/sendemail")
const user = require("../../models/user")
const forgot_password_token = require("../../models/forgot_password_token")

const app = express()

app.post("/forgot_password", async (req, res) => {
  var {
    username,
    resetpasslink
  } = req.body

  if (!(username)) {
    return res.status(203).json({
      success: 0,
      msg: "All inputs are required"
    })
  }

  // Validate if user exist in our database
  const user1 = await user.findOne({
    username
  })

  if (!user1) {
    return res.status(203).json({
      success: 0,
      msg: "User is not registered"
    })
  }

  var user_id = user1._id
  var user_email = user1.user_email_id

  // generate token

  const token = jwt.sign({
    user_id
  },
  process.env.TOKEN_KEY, {
    expiresIn: "900s",
  }
  )

  //check if old token exists
  const forgot_pass_sess1 = await forgot_password_token.findOne({
    user_id: user_id
  })

  //remove existing sessions before creating new one
  if(forgot_pass_sess1){
    await forgot_password_token.deleteMany({
      user_id: user_id
    }).then(function(){
      console.log("Deleted all records of old tokens") // Success
    }).catch(function(error){
      console.log(error) // Failure
    })
  }

  var date = new Date()
  const forgot_pass_sessionIgnored = await forgot_password_token.create({
    user_id: user_id,
    username: username,
    user_email_id: user1.user_email_id,
    token: token,
    created_at: date.getTime()
  })

  // link to reset password
  var link = `${process.env.BASE_URL}/reset-password?userId=${user1._id}&token=${token}`
  if (resetpasslink) {
    link = `${resetpasslink}?userId=${user1._id}&token=${token}`
  }
  var htmlmsg = "<img src='../common_api/logo123.png' alt='Logo'/><br/><h1>Reset Password for Testify Account</h1>"
  //link = link + '?userId=' + user1._id + '&token=' + token
  // send email to user to reset password
  var stat = await sendemail(user1.user_email_id, "Reset the password for Testify account", link, htmlmsg)
  if (stat) {
    return res.status(200).json({
      success: 1,
      msg: "Password reset link has been sent to your email account.",
      /*data: {
        user_id: user_id,
        token: token
      }*/
    })

  }
  // remove generated token if password reset fails
  await forgot_password_token.deleteOne({
    user_id: user_id,
    username: username
  })
  return res.status(203).json({
    success: 0,
    msg: "Could not send email"
  })
})

// route to reset password
app.post("/password_reset/:userId/:token", async (req, res) => {
  const {
    username,
    new_password
  } = req.body

  // read userID and token from url

  const userId = req.params.userId
  const token = req.params.token
  //console.log(userId)
  //console.log(token)

  // check if session exists
  const forgot_passwd_session = await forgot_password_token.findOne({
    user_id: userId,
    username: username
  })
  if (!forgot_passwd_session) {
    return res.status(203).json({
      success: 0,
      msg: "Link expired. Please generate new link."
    })
  }
  // check if token is expired
  now = new Date().getTime()
  if ((now - forgot_passwd_session.created_at) / (1000) > 900) {
    await forgot_password_token.deleteOne({
      user_id: userId,
      username: username
    })
    
    return res.status(203).json({
      success: 0,
      msg: "Link expired. Generate new link."
    })
  }
  // verify token
  try {
    const decodedIgnored = jwt.verify(token, process.env.TOKEN_KEY)
  } catch (err) {
    return res.status(203).json({
      success: 0,
      msg: "Invalid Token."
    })
  }
  if (!(username && new_password)) {
    return res.status(203).json({
      success: 0,
      msg: "All fields are required."
    })
  }
  // check if user exists.

  const user1 = await user.findOne({
    username
  })

  if (!user1) {
    return res.status(203).json({
      success: 0,
      msg: "User is not registered"
    })
  }

  //check if new password is existing password
  var matchPassword = bcrypt.compareSync(new_password, user1.user_password)

  if(matchPassword){
    return res.status(203).json({
      success: 0,
      msg: "Your new password can not be your old password."
    })
  }

  // encrypt new password
  const salt = bcrypt.genSaltSync(10)
  var changed_password = bcrypt.hashSync(new_password, salt)

  user1.user_password = changed_password

  //update password

  var updated = await user.updateOne({
    username
  }, user1)

  if (!updated) {
    return res.status(203).json({
      success: 0,
      msg: "Failed to reset the password"
    })
  }
  // remove generated token after password has been reset
  await forgot_password_token.deleteOne({
    user_id: userId,
    username: username
  })
  var stat = await sendemail(user1.user_email_id, "Successfully Changed the Password", `Hello ${user1.user_full_name},\nYou have successfully changed the password to your Testify account. In case, if you didn't change the password please reach out to us at developer2552@zohomail.in email id. We will address your query as soon as possible.\n\nThanks and Regards,\n<b>Testify Team</b>`)
  return res.status(200).json({
    success: 1,
    msg: "Password reset successful."
  })

})

module.exports = app