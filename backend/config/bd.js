import mongoose from 'mongoose';
// This function connects to the MongoDB database using Mongoose


const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Successfully connected to MongoDB");
        

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
// This function is used to connect to the MongoDB database using Mongoose.