let employees = []
const fileInput = document.getElementById("fileInput")
const previewEl = document.getElementById("preview")
const simulateBtn = document.getElementById("simulateBtn")
const resultsEl = document.getElementById("results")

// Handle JSON file upload
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      employees = JSON.parse(e.target.result)
      previewEl.textContent = JSON.stringify(employees, null, 2)
      simulateBtn.disabled = false
    } catch (err) {
      previewEl.textContent = "Invalid JSON file!"
      simulateBtn.disabled = true
    }
  }
  reader.readAsText(file)
})

// Simulate access
simulateBtn.addEventListener("click", async () => {
  if (employees.length === 0) {
    resultsEl.textContent = "Please upload a valid employee JSON first."
    return
  }

  try {
    const res = await fetch("http://localhost:3000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employees),
    })

    const data = await res.json()

    // Build results table
    let html = `<table>
      <tr><th>Employee ID</th><th>Result</th></tr>`

    data.results.forEach((emp) => {
      const id = Object.keys(emp)[0]
      const reasons = emp[id]
      const hasGranted = reasons.some((r) => r.includes("GRANTED"))
      const cssClass = hasGranted ? "granted" : "denied"

      html += `<tr>
        <td>${id}</td>
        <td class="${cssClass}"><ul>${reasons
        .map((r) => `<li>${r}</li>`)
        .join("")}</ul></td>
      </tr>`
    })

    html += `</table>`
    resultsEl.innerHTML = html
  } catch (err) {
    resultsEl.textContent = "Error: " + err.message
  }
})
