import messageModel from "../models/messageModel.js";
import projectModel from "../models/projectModel.js";

export const getAllMessages = async (req, res) => {
    try {
        const { projectId } = req.params; // Extract projectId from request parameters

        if (process.env.NODE_ENV === 'development') {
          console.log("Project ID:", projectId);
        }
    
        // Find the project by ID and populate the messages field
        const project = await projectModel.findById(projectId)
        .populate({
            path: 'messages',
            model: messageModel,
            populate: {
                path: 'senderId',
                model: 'User', // Assuming you have a User model for user details
                select: 'name email', // Select only the fields you need
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
    
        // Return the messages associated with the project
        res.status(200).json({ messages: project.messages });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching messages:", error);
        }
        res.status(500).json({ message: "Internal server error" });
    }
}