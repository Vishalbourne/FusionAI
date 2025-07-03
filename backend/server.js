import http from 'http';
import dotenv from 'dotenv'; 
dotenv.config(); // Load environment variables from .env file
import app from './app.js'; // Import the Express app
import { Server } from 'socket.io'; // Import Socket.IO
import jwt from 'jsonwebtoken'; // Import JWT for token verification
import mongoose from 'mongoose';
import projectModel from './models/projectModel.js';
import Message from './models/messageModel.js';
import gemini_Ai from './services/gemini.js'
// Create HTTP server with the Express app
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"]
    }
  });
  
  

// Set the port from environment variables or fallback to 3000
const PORT = process.env.PORT || 5000;

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || 
                      (socket.handshake.headers.authorization?.startsWith('Bearer ') 
                          ? socket.handshake.headers.authorization.split(' ')[1] 
                          : null);

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        const projectId = socket.handshake.query.projectId;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error("Invalid project ID"));
        }

        socket.project = await projectModel.findById(projectId);
        if (!socket.project) {
            return next(new Error("Project not found"));
        }

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error: Invalid token"));
            }
            socket.user = decoded;
            next();
        });
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Internal server error")); // Ensure error is an instance of Error
    }
});

io.on("connection", (socket) => {
    if (!socket.project) {
        console.error("Socket project is undefined");
        return socket.disconnect(true); // Disconnect if project is not set
    }

    socket.roomId = socket.project._id.toString();
    console.log("User connected to project:", socket.roomId);
    socket.join(socket.roomId);

    socket.on("projectMessage", async (data) => {
        try {
            console.log("Message received:", data);
            const message = data.message;
            const isAiPresent = message.includes("@ai");

            const newMessage = new Message({
                projectId: data.projectId,
                senderId: data.userId,
                content: data.message,
            });
            await newMessage.save();

            const project = await projectModel.findById(data.projectId);
            if (!project) {
                console.error("Project not found:", data.projectId);
                return;
            }
            project.messages.push(newMessage._id);
            await project.save();

            const populatedProject = await project.populate({
                path: "messages",
                populate: { path: "senderId", model: "User" }
            });

            const fullData = populatedProject.messages.map((message) => ({
                _id: message._id,
                content: message.content,
                senderId: {
                    _id: message.senderId?._id,
                    name: message.senderId?.name,
                    email: message.senderId?.email,
                },
                createdAt: message.createdAt,
            }));

            io.to(socket.roomId).emit("projectMessage", {
                _id: newMessage._id,
                content: newMessage.content,
                senderId: {
                    _id: newMessage.senderId,
                    name: socket.user.name,
                    email: socket.user.email,
                },
                createdAt: newMessage.createdAt,
            });

            if (isAiPresent) {
                const prompt = message.replace("@ai", "").trim();
                const result = await gemini_Ai(prompt).catch((err) => {
                    console.error("AI service error:", err);
                    return "Sorry, I couldn't process your request.";
                });

                const aiMessage = new Message({
                    projectId: data.projectId,
                    senderId: process.env.AI_USER_ID,
                    content: result,
                });
                await aiMessage.save();
                

                project.messages.push(aiMessage._id);
            await project.save();

                io.to(socket.roomId).emit("projectMessage", {
                    _id: aiMessage._id,
                    content: aiMessage.content,
                    senderId: {
                        _id: process.env.AI_USER_ID,
                        name: process.env.AI_USER_NAME || "AI Assistant",
                        email: process.env.AI_USER_EMAIL || "ai@yourapp.com",
                    },
                    createdAt: aiMessage.createdAt,
                });
            }
        } catch (error) {
            console.error("Error handling projectMessage event:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Listen on the specified port
server.listen(PORT, () => {
    // Log only in development mode
    if (process.env.NODE_ENV === 'development') {
        console.log(`Server is running on port ${PORT}`);
    }
});