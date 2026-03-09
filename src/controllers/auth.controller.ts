import { Request, Response } from "express"
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { encrypt } from "../utils/encryption";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegisterRequest = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;
    password: string;
}

const registerValidationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),

    username: Yup.string().required("Username is required"),

    email: Yup.string().email("Invalid email format").required("Email is required"),

    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),

    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Confirm password is required")
});

export default {
    async register (req: Request, res: Response) {
        const {
            fullName,
            username,
            email,
            password,
            confirmPassword
        } = 
        req.body as unknown as TRegisterRequest;

        try {
        await registerValidationSchema.validate({
            fullName,
            username,
            email,
            password,
            confirmPassword,
        });

        const result = await UserModel.create({
            fullName,
            username,
            email,
            password,
        });

            res.status(200).json({ 
                message: "Registration successful" ,
                data: result,
            });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ message: err.message, data: null});
        }
    },
    async login (req: Request, res: Response) {
        const {
            identifier, 
            password
        } = req.body as unknown as TLogin;

        try {
            //ambil data user berdasarkan email atau username (identifier)

            const userByIdentifier = await UserModel.findOne({
                $or: [
                    { email: identifier },
                    { username: identifier }
                ]
            });
            
        if (!userByIdentifier) {
            return res.status(400).json({ message: "User not found", data: null });
        }

            //validasi password
            
        const validatedPassword: boolean = encrypt(password) === userByIdentifier.password;

        if (!validatedPassword) {
            return res.status(400).json({ message: "Invalid password", data: null });
        }

        const token = generateToken({
            id: userByIdentifier._id,
            role: userByIdentifier.role,
        });
        
        
        res.status(200).json({ message: "Login successful", data: token, });

    }

        catch (error) {
            const err = error as Error;
            res.status(400).json({ message: err.message, data: null});                
        }
},

    async me (req: IReqUser, res: Response) {
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user profile",
                data: result,
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ message: err.message, data: null});
        }
    }
}