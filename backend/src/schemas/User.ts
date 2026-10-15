import {Schema, Types} from "mongoose";

interface UserType{
    _id: Types.ObjectId,
    username: string,
    email: string,
    password: string,
    description: string,
    createdAt: Date,
    isAdmin: boolean,
    isBanned?: boolean,
    isMainAdmin? : boolean,
    favouritePatterns: Array<Types.ObjectId>,
    publicPatterns: Array<Types.ObjectId>,
    privatePatterns: Array<Types.ObjectId>
}



const userSchema =new Schema<UserType>({
    username: {type: Schema.Types.String, required: true, unique: true},
    email: {type: Schema.Types.String, required: true, unique: true},
    password: {type: Schema.Types.String, required: true},
    description: {type: Schema.Types.String, required: true},
    createdAt: {type: Schema.Types.Date, required: true},
    isAdmin: {type: Schema.Types.Boolean, required: true},
    isBanned: {type: Schema.Types.Boolean, required: false},
    isMainAdmin: {type: Schema.Types.Boolean, required: false},
    favouritePatterns: {type: [Schema.Types.ObjectId]},
    publicPatterns: {type: [Schema.Types.ObjectId]},
    privatePatterns: {type: [Schema.Types.ObjectId]}
})

export { userSchema, type UserType }