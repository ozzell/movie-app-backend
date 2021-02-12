require('dotenv').config()
const express = require('express')
const {fetchMovies, fetchMovie, fetchReview} = require('./routes/movie-api')

const app = express()

app.get('/', (req, res) => {
  res.send('<h1>Movie app</h1>')
})

app.get('/search-movies', async (req, res) => {
  console.log('search-movies')
  const searchString = req.query.s
  const movies = await fetchMovies(searchString)
  movies
    ? res.send(movies)
    : res.status(404).end()
})

app.get('/movie', async (req, res) => {
  const searchString = req.query.i
  const movie = await fetchMovie(searchString)
  movie
    ? res.send(movie)
    : res.status(404).end()
})

app.get('/review', async (req, res) => {
  const searchString = req.query.r
  const review = await fetchReview(searchString)
  review
    ? res.send(review)
    : res.status(404).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})