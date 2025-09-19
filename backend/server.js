import express from "express"

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
  res.json({ message: "Simulation received", employees })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
