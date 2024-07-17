//Libraries import
import express from 'express';
import cors from "cors";


//Custom imports
import { customError } from './utils/error.js';
import { chats } from './data/data.js';
import { dbConnect } from './database/db.js';
import { PORT } from './utils/config.js';
import { userRoutes } from './routers/UserRoutes.js';
import { chatRoutes } from './routers/ChatRoutes.js';
import { messageRoutes } from './routers/MessageRoutes.js';
import { Server } from "socket.io";


const app = express();
app.use(express.json());
app.use(cors());

//Database connect
dbConnect()

app.get('/', (req, res) => {
    res.json(chats)
})
app.get('/api/chat/:id', (req, res) => {
    console.log(req.params.id)
    const chat = chats.find(c => c._id === req.params.id);
    if (!chat) {
        return res.status(400).json(customError('Chat not found', 404));
    }
    return res.json(chat);
})

// Api routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/message', messageRoutes);



const server = app.listen(PORT, () => {
    console.log(`Server is up and listening at ${PORT}`);
})

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        console.log(userData._id);
        socket.join(userData._id);
        socket.emit("connection")
    })

    socket.on("join chat", (roomId) => {
        socket.join(roomId);
        console.log("User Joined Room", roomId);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("send message", (message) => {
        console.log(message)
        var chat = message.chat;

        if(!chat.users) return console.log("chats.users not defined");

        chat.users.forEach(user => {
            if(user._id === message.sender._id) return;
            console.log(user)
            socket.in(user._id).emit("new message received", message);
        })
    })
})