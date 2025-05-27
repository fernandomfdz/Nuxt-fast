import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'content/blog/categories.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return data
  } catch (error) {
    console.error('Error reading categories file:', error)
    return { categories: [] }
  }
}) 