import express from "express"
import { readJSON, stringToTime } from "./utils.js"
import cors from "cors"

const app = express()
const PORT = 3000

// Middleware to parse JSON body
app.use(express.json())
app.use(cors())

let roomRules = await readJSON("./roomRules.json")

let lastVisited = {}

function auth(user) {
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

// Simulation endpoint (we'll plug in your logic here later)
app.post("/simulate", (req, res) => {
  const employees = req.body // array of employees
  lastVisited = {}
  let results = employees.map((employee) => auth(employee))
  res.json({ message: "Simulation received", results })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
