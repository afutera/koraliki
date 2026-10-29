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