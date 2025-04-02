const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://user:user123@cluster0.jtivbbk.mongodb.net/E-commerces")
        console.log("Mongo DB Connected: ", conn.connection.host)
    }
    catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB