const express = require('express');
const methodOverride = require('method-override');
require('./config/dbConnet')();
const taskRoute = require('./routes/taskRoutes');
require('dotenv').config();



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static('public'));
app.set('view engine','ejs');

app.use('/',taskRoute);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server running on the port number ${port}`);
})