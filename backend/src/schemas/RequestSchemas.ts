import {GetAllUnits} from "@shared/interfaces/patternsizeunits.js"

export const idSchema = {
  schema:{
    params:{
      properties:{
          id: {type: "string", pattern: "[0-9A-Fa-f]{24}"}
      }
    }
  }
}
export interface IdParams{
    Params:{id:string}
}

export const addPatternSchema = {
    body:{
      type: "object",
      required: ["title","height","width","unit","palette"],
      additionalProperties: false,
      properties: {
          title: {type:"string", minLength:1, maxLength: 30},
          height: {type:"number", minimum: 1, maximum: 256, multipleOf: 1},
          width: {type:"number", minimum: 1, maximum: 256, multipleOf: 1},
          unit: {type: "string", enum: GetAllUnits()},
          palette: {type: "string", pattern: "[0-9A-Fa-f]{24}"}
      }
    }
}
//edycja przychodzi w stringu jako JSON i pliki osobno, walidacja nie w fastify, tylko w dekodowaniu
/*username: {type: Schema.Types.String, required: true, unique: true},
    email: {type: Schema.Types.String, required: true, unique: true},
    password: {type: Schema.Types.String, required: true}, */
const passwdSchema={
  type: "string",
  minLength: 10
}
export const addUserSchema = {
  body:{type:"object",
    additionalProperties:false,
    required:["username","email","password","repeatPassword"],
    properties:{
        username:{type:"string",minLength:1, maxLength: 30},
        email:{type:"string"},
        password: passwdSchema,
        repeatPassword: passwdSchema
    }
  }
}