import express from "express"
import { auth } from "./utils.js"

const app = express()
const PORT = 3000

// Middleware to parse JSON body
app.use(express.json())

// Simple route
app.get("/", (req, res) => {
  res.send("Access Simulator Backend Running 🚀")
})

// Simulation endpoint (we'll plug in your logic here later)
app.post("/simulate", (req, res) => {
  const employees = req.body // array of employees

  let results = employees.map((employee) => auth(employee))
  res.json({ message: "Simulation received", results })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
