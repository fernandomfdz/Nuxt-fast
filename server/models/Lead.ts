import mongoose from 'mongoose'
import toJSON from './plugins/toJSON'

export interface ILead {
  email: string
  createdAt?: Date
  updatedAt?: Date
}

// LEAD SCHEMA se usa para almacenar los leads generados desde la landing page.
// Lo usarías si tu producto aún no está listo y quieres recolectar emails
// El componente <ButtonLead /> y la ruta /api/lead se usan para recolectar los emails
const leadSchema = new mongoose.Schema<ILead>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

// agregar plugin que convierte mongoose a json
leadSchema.plugin(toJSON)

// Exportar el modelo
export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema) 