// importing user context
const express = require("express")

const auth = require("../../middleware/auth")


const app = express()

// Lougout the user
app.get("/authentication/logout", auth, async (req, res) => {
  try {
    res.clearCookie("userData")
    return res.status(200).json({
      success: 1,
      msg: "Logged out successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(203).json({
      success: 0,
      msg: "Unable to logout"
    })
  }
})

module.exports = app