const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables


//mongodb connection fuction
const dbConnect = async()=>{

    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log('Database connected successfully')
        
    } catch (error) {
        console.log('Error connecting the database',error.message);
        process.exit(1)
        
    }

}

module.exports = dbConnect;


