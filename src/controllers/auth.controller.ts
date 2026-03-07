import { Request, Response } from "express"
import * as Yup from "yup";
import UserModel from "../models/user.model";

type TRegisterRequest = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

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
    }
};