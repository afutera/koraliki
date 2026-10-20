import {Schema, Types} from "mongoose";
import {type SharedPrivateUser} from "@shared/interfaces/user.js"

interface UserType extends SharedPrivateUser<Types.ObjectId> {}

const userSchema =new Schema<UserType>({
    username: {type: Schema.Types.String, required: true, unique: true},
    email: {type: Schema.Types.String, required: true, unique: true},
    password: {type: Schema.Types.String, required: true},
    description: {type: Schema.Types.String, required: true},
    createdAt: {type: Schema.Types.Date, required: true},
    isAdmin: {type: Schema.Types.Boolean, required: true},
    isMainAdmin: {type: Schema.Types.Boolean, required: false},
    favouritePatterns: {type: [Schema.Types.ObjectId]},
})

export { userSchema, type UserType }