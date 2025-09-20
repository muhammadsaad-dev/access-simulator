import { readFile } from "fs/promises"

function stringToTime(timeString) {
  // Split the string into hours and minutes
  const [hours, minutes] = timeString.split(":").map(Number)

  // Create a new Date object for today
  const date = new Date()
  date.setHours(hours, minutes, 0, 0) // set hours, minutes, seconds, ms

  return date
}

async function readJSON(filePath) {
  try {
    const jsonString = await readFile(filePath, "utf8")
    return JSON.parse(jsonString)
  } catch (err) {
    console.error("Error reading JSON file:", err)
    return null
  }
}

let roomRules = await readJSON("./roomRules.json")
let lastVisited = {}

export function auth(user) {
  const room = user.room
  let result = { [user.id]: [] }

  if (user.access_level < roomRules[room].minAccessLevel) {
    result[user.id].push(
      `ACCESS DENIED: ${user.id}'s access level is low for the requested room.`
    )
  }
  let requestTime = stringToTime(user.request_time)
  let openTime = stringToTime(roomRules[room].openTime)
  let closeTime = stringToTime(roomRules[room].closeTime)
  let cooldownTime = roomRules[room].cooldownTime

  if (requestTime < openTime || requestTime > closeTime) {
    result[user.id].push("ACCESS DENIED: Requested room is closed right now.")
  }

  let record = lastVisited[`${user.id}_${room}`]
  if (record) {
    let diff = (requestTime - record) / (1000 * 60)
    if (diff < cooldownTime) {
      result[user.id].push(
        `ACCESS DENIED: Cooldown period is still active, Try again in ${
          cooldownTime - diff
        } minutes`
      )
    }
  }
  lastVisited[`${user.id}_${room}`] = requestTime

  if (result[user.id].length == 0) {
    result[user.id].push(`ACCESS GRANTED: All conditions are fulfilled.`)
  }

  return result
}
