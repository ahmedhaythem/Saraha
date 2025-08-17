import dotenv from "dotenv";
import "./DB/connection.js";
import userRoutes from "./modules/userModule/users.controller.js";
import noteRoutes from "./modules/noteModule/notes.controller.js";
import authRoutes from "./modules/authModule/auth.controller.js";
import { sendEmail } from "./utils/sendEmail/sendEmail.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

export default function bootstrap(app, express) {
    app.use(express.json());

    
    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/notes", noteRoutes);


    // sendEmail()
    app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    });
}
