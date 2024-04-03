const express = require('express')
const cors =require('cors')
const path = require('path')
const { Server } = require("socket.io");
const socketManager = require('./src/services/socket')
const mongoose = require('mongoose')
const userRoute = require('./src/interfaces/routes/userRoute')
const adminRoute = require('./src/interfaces/routes/adminRoute')
const doctorRoute = require('./src/interfaces/routes/doctorRoute');
const ChatUsecases = require('./src/usecases/ChatUsecases');
require('dotenv').config()
require('./src/config/mongo')


const app = express()



app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
// app.use('/images',express.static("images"))
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));


app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/doctor", doctorRoute);




const port = process.env.PORT || 5000

// Serve static files from the React build output directory
// app.use(express.static(path.join(__dirname, 'dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });


const server = app.listen(port, (req, res) => {
    console.log(`the server is running on http://localhost:${port}`);
})
const io = new Server(server, { cors: true });

io.on("connection", async (socket) => {
    socket.on("test", (data) => {
    });
  });
  io.on("connection", async (socket) => {
    socket.on(
      "SentMessage",async (data) => {
        const result = await ChatUsecases.saveChat(data)
        console.log('result in server- for message:',result);
        io.emit("SentUpdatedMessage", result);
      }
    );
  
  });
socketManager(io);
//console.log("*********----the socketManager reinitialized----***********");


// app.listen(port, (req, res) => {
//     console.log(`the server is running on http://localhost:${port}`);
// })