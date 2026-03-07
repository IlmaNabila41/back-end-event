import express from "express";
import bodyParser from "body-parser";
import authController from "./controllers/auth.controller";
import router from "./routes/api";
import db from "./utils/database"
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

async function init() {
    try{
        await db();
        console.log("Connected to the database successfully.");

        const app  = express();

        const PORT: number = 5000;

        app.use(bodyParser.json());
        app.use('/api', router);



        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

init();
