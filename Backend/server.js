import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log("Connected with the Database!");
  } catch (err) {
    console.error("MongoDB Connection Error", err.message);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

//app.post("/test", async (req, res) => {
// const options = {
//     method: "POST",
//     headers:{
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [{role: "user", content: req.body.message}],
//         // max_tokens: 100
//     })
// }

// try{
//     const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//     const data = await response.json();
//     //console.log(data.choices[0].message.content);
//     res.send(data.choices[0].message.content);
// }
// catch(err){
//     console.error(err);
//     res.status(500).send("Server Error");
// }
//});
