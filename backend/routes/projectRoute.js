import expess from "express";
import { createProject,getAllProjects,addUserToProject,getProjectById, deleteProject} from "../controllers/projectController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = expess.Router();

// Route to create a new project
router.post("/create", isLoggedIn, createProject);

router.get("/getProjects", isLoggedIn,getAllProjects);

router.put("/addUser", isLoggedIn, addUserToProject);

router.get("/getProject/:projectId", isLoggedIn, getProjectById);

router.delete("/deleteProject/:projectId",isLoggedIn,deleteProject)

export default router;