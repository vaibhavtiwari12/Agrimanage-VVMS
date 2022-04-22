const mongoose = require("mongoose");

const createDBConnection = async () =>  {
    return await mongoose.connect(`${process.env.MONGO_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
}
const closeConnection = async () => {
    return await mongoose.connection.close()
}
module.exports = {createDBConnection, closeConnection};