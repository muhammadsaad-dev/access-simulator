import { readFile } from "fs/promises"

export function stringToTime(timeString) {
  // Split the string into hours and minutes
  const [hours, minutes] = timeString.split(":").map(Number)

  // Create a new Date object for today
  const date = new Date()
  date.setHours(hours, minutes, 0, 0) // set hours, minutes, seconds, ms

  return date
}

export async function readJSON(filePath) {
  try {
    const jsonString = await readFile(filePath, "utf8")
    return JSON.parse(jsonString)
  } catch (err) {
    console.error("Error reading JSON file:", err)
    return null
  }
}
