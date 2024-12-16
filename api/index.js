import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.listen(3000, () => {
    console.log("Server is running on PORT 3000");
});


app.use("/api/user/", userRouter); // Thats the route we wanna check and we check all the pathnames inside the userRouter