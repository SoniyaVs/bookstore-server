
const mongoose = require('mongoose');


// get connection string from .env file

const connectionString = process.env.ATLASDBCONNECTION

// console.log(connectionString);

mongoose.connect(connectionString).then(res => console.log('MongoDB connection successful')).catch(err => console.log('DB connection failed', err));

