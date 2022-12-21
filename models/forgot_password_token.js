/*
Functions of this page:-
1. To generate schema to save forgot password session.
*/

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const forgotpasswd_tokenSchema = new mongoose.Schema({
  user_id: { type: String },
  user_email_id: { type: String },
  username: { type: String },
  token: { type: String },
  created_at: { type: String }
})

module.exports = mongoose.model("forgot_password_token", forgotpasswd_tokenSchema)