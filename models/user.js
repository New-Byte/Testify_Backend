/*
Functions of this page:-
1. To generate schema for users collection
*/

const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
const userSchema = new mongoose.Schema({
  user_full_name: {
    type: String,
    default: null
  },
  user_email_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  user_password: {
    type: String
  },
  user_profile_image: {
    type: String
  },
  user_role: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("user", userSchema)