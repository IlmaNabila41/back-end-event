import mongoose from "mongoose";

const connect = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;

        if (!dbUrl) {
            throw new Error("Variabel DATABASE_URL tidak ditemukan di .env");
        }

        await mongoose.connect(dbUrl);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1);
    }
};

export default connect;