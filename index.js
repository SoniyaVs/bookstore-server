
// import dotenv,express,cors
// Loads .env into file content into process.env by default

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/routing')
require('./config/db')

// create server using server
const bookstoreServer = express()

bookstoreServer.use(cors())

bookstoreServer.use(express.json())

bookstoreServer.use(router)
// enable static files
bookstoreServer.use('/uploads', express.static('./uploads'))


// create port
const PORT = 3000

// server listen in that port
bookstoreServer.listen(PORT, () => {
    console.log("BookStore Server Started ...And waiting for client request");

})

// resolve get request to http/localhost/3000 using server
bookstoreServer.get('/', (req, res) => {
    res.status(200).send('<h1>BookStore Server Started ...And waiting for client request</h1>')
})