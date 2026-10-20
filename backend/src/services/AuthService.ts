import bcrypt from "bcrypt"
import {type UserType } from "@schemas/User.js"
import { Model, Types } from "mongoose"
import { type JwtDecorator } from "@fastify/jwt"
import {} from "@shared/interfaces/user.js"

interface AuthUserInfo{
    _id: Types.ObjectId,
    username: string,
    isAdmin: boolean,
    isMainAdmin: boolean
}



class AuthService{
    model: Model<UserType>
    jwt: JwtDecorator
    constructor(users: Model<UserType>, jwt: JwtDecorator){
        this.model=users
        this.jwt=jwt
    }
    //jedna funkcja do haszowania do użycia tutaj i w seed.ts
    static async hashPassword(pass: string){
    return await bcrypt.hash(pass, parseInt(process.env.SALT_ROUNDS ?? "10"))
    }

    //tymczasowa metoda do testow dodawania obrazow bez zrobionej autentykacji, loguje wszystkich na pierwszego uzytkownika
    async MOCK_GetUserFromToken(jwtToken: string): Promise<AuthUserInfo|Error>{
        const found=await this.model.findOne({},{_id:1, username: 1, isAdmin: 1, isMainAdmin:1})
        if(found===null) return new Error("Nie znaleziono użytkownika");
        return {_id: found._id, username: found.username, isAdmin: found.isAdmin, isMainAdmin: found.isMainAdmin===undefined ? false:found.isMainAdmin};
    }
}

export default AuthService
export {type AuthUserInfo}