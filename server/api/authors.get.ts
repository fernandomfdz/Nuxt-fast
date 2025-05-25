import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'content/blog/authors.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return data
  } catch (error) {
    console.error('Error reading authors file:', error)
    return { authors: [] }
  }
}) 