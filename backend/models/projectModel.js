import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Ensure that name is required
        unique: true,  // Ensure that project names are unique
        trim: true,  // Remove extra spaces
        minlength: 3,  // Min length validation
        maxlength: 50,  // Max length validation
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',  // Reference to the Message model
    }],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
