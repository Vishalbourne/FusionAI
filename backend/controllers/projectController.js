import projectModel from '../models/projectModel.js';
import validateProject from '../validators/projectValidator.js';
import mongoose from 'mongoose';

export const createProject = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }

        // Validate the request body
        const { error } = validateProject({ name, users: [req.user._id.toString()] });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if a project with the same name already exists
        const existingProject = await projectModel.findOne({ name });
        if (existingProject) {
            return res.status(400).json({ message: 'Project already exists' });
        }

        // Create the new project
        const project = new projectModel({
            name,
            users: [req.user._id], // Add the current user's ID
        });

        // Save the project to the database
        await project.save();

        return res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await projectModel.find({ users: req.user._id }).populate('users', 'name email');

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: 'No projects found' });
        }

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

export const addUserToProject = async (req, res) => {
    try {
        const { projectId, users } = req.body;

        // Validate projectId
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid or missing Project ID' });
        }

        // Validate users array
        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Users are required and must be an array' });
        }

        const invalidUsers = users.filter(userId => !mongoose.Types.ObjectId.isValid(userId));
        if (invalidUsers.length > 0) {
            return res.status(400).json({ message: 'One or more user IDs are invalid', invalidUsers });
        }

        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check permissions
        if (!project.users.includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'You do not have permission to add users to this project' });
        }

        // This User is Already in the Project
        const alreadyInProject = users.filter(userId => project.users.includes(userId));
        if (alreadyInProject.length > 0) {
            return res.status(400).json({ message: 'Some users are already in the project', alreadyInProject });
        }

        // Add users without duplicates
        const currentUsersSet = new Set(project.users.map(id => id.toString()));
        users.forEach(userId => currentUsersSet.add(userId));

        project.users = [...currentUsersSet];

        await project.save();

        return res.status(200).json({ message: 'Users added to project successfully', project });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding users to project', error: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Validate projectId
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid or missing Project ID' });
        }

        const project = await projectModel.findById(projectId).populate('users');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Check permissions
        if (!project.users.some(user => user._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'You do not have permission to view this project' });
        }

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (process.env.NODE_ENV === 'development') {
            console.log(projectId);
        }

        // Validate projectId
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid or missing Project ID' });
        }

        // Find the project
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the requesting user is part of the project
        if (!project.users.some(user => user.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'You do not have permission to delete this project' });
        }

        // Delete the project
        await projectModel.findByIdAndDelete(projectId);

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error deleting project:', error.message);
        }
        return res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};
