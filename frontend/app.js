// Sample static employee data
const employees = [
  { id: "EMP001", access_level: 2, request_time: "09:15", room: "ServerRoom" },
  { id: "EMP002", access_level: 1, request_time: "09:30", room: "Vault" },
  { id: "EMP003", access_level: 3, request_time: "10:05", room: "ServerRoom" },
  { id: "EMP004", access_level: 3, request_time: "09:45", room: "Vault" },
  { id: "EMP005", access_level: 2, request_time: "08:50", room: "R&D Lab" },
  { id: "EMP006", access_level: 1, request_time: "10:10", room: "R&D Lab" },
  { id: "EMP007", access_level: 2, request_time: "10:18", room: "ServerRoom" },
  { id: "EMP008", access_level: 3, request_time: "09:55", room: "Vault" },
  { id: "EMP001", access_level: 2, request_time: "09:28", room: "ServerRoom" },
  { id: "EMP006", access_level: 1, request_time: "10:15", room: "R&D Lab" },
]

// Load employees into table
const tbody = document.querySelector("#employeeTable tbody")
employees.forEach((emp) => {
  const tr = document.createElement("tr")
  tr.innerHTML = `
    <td>${emp.id}</td>
    <td>${emp.access_level}</td>
    <td>${emp.request_time}</td>
    <td>${emp.room}</td>
  `
  tbody.appendChild(tr)
})

// Handle simulate button click
document.getElementById("simulateBtn").addEventListener("click", async () => {
  const resultsList = document.getElementById("results")
  resultsList.innerHTML = "<li>Loading...</li>"

  try {
    const response = await fetch("http://localhost:3000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employees),
    })
    const data = await response.json()
    console.log(data)

    // Clear loading
    resultsList.innerHTML = ""

    // Display results
    data.results.forEach((result) => {
      const li = document.createElement("li")
      const res = Array.isArray(result) ? Object.entries(result)[0] : result // adapt to your backend format
      li.innerHTML = `<strong>${
        res.id
      }</strong>: <span class="${res.status.toLowerCase()}">${res.status} - ${
        res.reason
      }</span>`
      resultsList.appendChild(li)
    })
  } catch (err) {
    resultsList.innerHTML = `<li style="color:red">Error: ${err.message}</li>`
  }
})
