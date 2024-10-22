const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true

    },
    status:{
        type:String,
        enum:['Pending','Completed','Pending'],
        default:'Pending'

    },
    date:{
        type:Date,
        default:Date.now

    }
});

module.exports = mongoose.model('task',taskSchema);
