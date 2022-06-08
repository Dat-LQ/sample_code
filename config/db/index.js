const mongoose = require('mongoose');
async function connectDb() {
    try {
        await mongoose.connect('mongodb://localhost:27017/my_db');
        console.log("connect succes!")
    }
    catch(e){
       console.log ("connect fail!"+ e)
    }
}
    

module.exports = { connectDb };