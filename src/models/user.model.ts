import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

export interface User {
    fullName: string;
    email: string;
    password: string;
    username: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    fullName: {
         type: Schema.Types.String, required: true },

    username: { 
        type: Schema.Types.String, required: true },

    email: { 
        type: Schema.Types.String, required: true },

    password: { 
        type: Schema.Types.String, required: true },

    role: { 
        type: Schema.Types.String, enum: ["admin", "user"], default: "user" },

    profilePicture: { 
        type: Schema.Types.String, default: "user.jpg" },

    isActive: { 
        type: Schema.Types.Boolean, default: false },

    activationCode: { 
        type: Schema.Types.String }
}, { 
    timestamps: true 
}
);

userSchema.pre("save", function (){
    const user = this;
    user.password = encrypt(user.password);
});

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    delete userObject.password;
    
    return userObject;
};

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;