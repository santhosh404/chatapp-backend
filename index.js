//Libraries import
import express from 'express';
import cors from "cors";


//Custom imports
import { customError } from './utils/error.js';
import { chats } from './data/data.js';
import { dbConnect } from './database/db.js';
import { PORT } from './utils/config.js';
import { userRoutes } from './routers/UserRoutes.js';


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
app.use('/api/v1/user', userRoutes)



app.listen(PORT, () => {
    console.log(`Server is up and listening at ${PORT}`);
})