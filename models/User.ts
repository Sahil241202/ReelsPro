import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs"

// Define User interface and schema for Mongoose model
export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updateAt?: Date;
}

// Create Mongoose model and apply schema to it. If the model already exists, it will return the existing model.
const userSchema = new Schema<IUser>(
    {
        email: {type: String, required: true,unique: true},
        password: {type: String, required: true},
    },
    {timestamps: true}
);

// Hash password before saving to the database. This is done using pre-save hook.
userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        //hash the password
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

// Export the User model. If the model does not exist, it will be created with the specified schema.
const User = models?.User || model<IUser>("User",userSchema);

export default User;