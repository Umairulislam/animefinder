import express from "express"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const API_URL = "https://api.jikan.moe/v4"

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

// Middleware for setting the header and footer
app.use((req, res, next) => {
  res.locals.header = "header"
  res.locals.footer = "footer"
  next()
})

// Route to display the search form and results
app.get("/", (req, res) => {
  res.render("index", { results: null })
})

// Route to handle search requests
app.get("/search", async (req, res) => {
  const query = req.query.q
  try {
    const response = await axios.get(`${API_URL}/anime`, {
      params: {
        q: query,
      },
    })
    const results = response.data.data // Updated to match the new API response structure
    res.render("index", { results })
    console.log(results)
  } catch (error) {
    console.error("Error fetching search results:", error.message)
    res.render("error", { message: "Failed to fetch data" })
  }
})

// Route to display anime details
app.get("/anime/:id", async (req, res) => {
  const animeId = req.params.id
  try {
    const response = await axios.get(`${API_URL}/anime/${animeId}`)
    const anime = response.data.data // Updated to match the new API response structure
    res.render("anime-details", { anime })
  } catch (error) {
    console.error("Error fetching anime details:", error.message)
    res.render("error", { message: "Failed to fetch data" })
  }
})

app.listen(PORT, () => {
  console.log(`AnimeFinder is running on port ${PORT}`)
})
