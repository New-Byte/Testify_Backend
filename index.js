// create server and connect routes
//import packages
require("dotenv").config()
require("./database/database").connect()

const cors = require('cors')
const express = require("express")
const cookieParser = require('cookie-parser')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const port = process.env.API_PORT || process.env.PORT

const register = require('./src/authentication/register')
const login = require('./src/authentication/login')
const logout = require('./src/authentication/logout')
const forgot_password = require('./src/authentication/forgot_password')

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/backend', register)
app.use('/backend', login)
app.use('/backend', logout)
app.use('/backend', forgot_password)

//Swagger initialization
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Testify',
      description: 'Testify Backend Documentation',
      contact: {
        name: "Prodapt",
      },
      servers: [`http://localhost:${port}`]
    }
  },
  apis: ["index.js"]
}
  
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/backend/api-docs/testify", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//Swagger definition

/**
 * @swagger
 * /backend/authentication/register:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Register User
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Register User
 *        required: true
 *        example: {"user_full_name": "Tony Stark", "user_email_id": "developer2552@gmail.com","username": "ironman", "user_password": "1234", "user_role":"admin", "user_profile_image":"53c2eeba061f43c00c2478cc"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /backend/authentication/login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Login User
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Login User
 *        required: true
 *        example: {"username": "ironman","user_password": "asdf"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /backend/authentication/logout:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: Logout User
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /backend/forgot_password:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Route to initiate reset password
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Forgot password ?
 *        required: true
 *        example: { "username": "ironman" }
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /backend/password_reset/{userId}/{token}:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Route to reset password
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: userId
 *        required: true
 *      - in: path
 *        name: token
 *        description: token
 *        required: true
 *      - in: body
 *        name: body
 *        description: Paste the link from your e-mail
 *        required: true
 *        example: { "username": "ironman", "new_password": "asdf" }
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */


// server listening 
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})