import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectdb } from './src/db/dbconfig.js';
import { Document } from './src/model/document.js';

const app = express();
const server = createServer(app);
dotenv.config();

const io = new Server(server);
const port = process.env.PORT || 4000;
const corsOptions = {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

const defaultValue = ""

io.on('connection', (socket) => {

    socket.on("get-document", async documentUrl => {


        const document = await findOrCreateDocument(documentUrl);

        socket.join(documentUrl);
        socket.emit("load-document", document.data)

        socket.on('send-changes', (delta) => {
            console.log('delta', delta)
            socket.broadcast.to(documentUrl).emit('receive-changes', delta)
        })


        socket.on("save-document", async data => {
            await Document.findOneAndUpdate(
                { url: documentUrl }, // Filter by URL
                { data }, // Update the data
                { new: true, upsert: true } // Options: return the updated document and create if it doesn't exist
            );
        });
    })

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
    // socket.disconnect()
});

async function findOrCreateDocument(id) {
    if (id == null) return

    //find the document by id 
    const document = await Document.findOne({ url: id });

    //if got the document than return the document 
    if (document) return document;

    //otherwise crate the new documents 
    return await Document.create({
        url: id,
        data: defaultValue

    })
}



server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
    connectdb()
});