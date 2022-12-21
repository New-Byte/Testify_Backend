const jwt = require("jsonwebtoken")
require("dotenv").config()

const sessionSchema = require('../models/session')

// function to verify token
const verifyToken = async (req, res, next) => {

  // check if user is logged in
  if (!req.cookies["userData"]) {
    return res.status(203).json({
        success: 0,
        error: "You are not logged in.",
    })
  }
  try {
    // read cookie
    const final_token = req.cookies["userData"]

    if (typeof (final_token) == "string") {
        token = final_token
    } else {
        token = final_token.token
    }

    //verify token
    var verified_user_id = -1
    const verifiedIgnored = jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {

      if (err) {
        if (err.name == "TokenExpiredError") {
          res.clearCookie("userData")
          return res.status(203).json({
            success: 0,
            msg: "Your session was timeout. Please login again",
          })
        }

      } else {
        if (decoded.token_last == true) {
          return res.status(203).json({
            success: 0,
            msg: "Internal Server Error",
          })
        }
        verified_user_id = decoded.user_id
      }

    })

    // check if user exists in session
    if (verified_user_id != -1) {
      var checkToken1 = await sessionSchema.findOne({
        user_id: verified_user_id
      })

      if (checkToken1 && checkToken1.jwt_token) {
        var user_detailsIgnored = checkToken1
      }

      if (!verified_user_id) {
        return res.status(203).json({
          success: 0,
          msg: "Invalid Token Error.",
        })
      }

      await checkToken1.save()
      // update session

      const updated = {
        last_requested_at: new Date()
      }

      await sessionSchema.updateOne(updated, {
        where: {
          user_id: checkToken1.user_id
        }
      }).then(async num => {
        if (num == 1) {
          console.log("The Token was updated")
        }
      })
      req.user = {
        user_id: verified_user_id
      }
      next()
    } else {
        console.log("Session Expired")
        return res.status(203).json({
            success: 0,
            msg: "Session Expired."
        })
    }

  } catch (error) {
    console.log(error)
    return res.status(203).json({
      success: 0,
      msg: "Invalid Token",
    })
  }
}

module.exports = verifyToken