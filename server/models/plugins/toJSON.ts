/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema } from 'mongoose'

/**
 * Un plugin de mongoose para aplicar las siguientes modificaciones en el método toJSON():
 * - eliminar campos privados (campos con la opción private: true)
 * - reemplazar _id con id
 * - eliminar __v
 */

const toJSON = (schema: Schema): void => {
  const transform = (doc: any, ret: any): any => {
    // Convertir _id a id
    if (ret._id) {
      ret.id = ret._id.toString()
      delete ret._id
    }
    
    // Eliminar __v
    delete ret.__v
    
    // Eliminar campos privados
    Object.keys(schema.paths).forEach((path) => {
      const schemaPath = (schema.paths as any)[path]
      if (schemaPath?.options?.private) {
        delete ret[path]
      }
    })

    return ret
  }

  // Configurar la transformación
  const schemaOptions = (schema as any).options
  if (!schemaOptions.toJSON) {
    schemaOptions.toJSON = {}
  }
  
  schemaOptions.toJSON.transform = transform
}

export default toJSON 