/*
Functions of this page:-
1. To generate schema to store user session.
*/
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const sessionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  jwt_token: { 
    type: String 
  },
  last_requested_at: { 
    type: Date,
    default: Date.now
  }
})


module.exports = mongoose.model("session", sessionSchema)