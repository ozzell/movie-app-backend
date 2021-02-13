require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {fetchMovies, fetchMovie, fetchReview} = require('./routes/movie-api')

const app = express()

app.use(cors())

const noMovieErrorResponse = res => res.status(404).send({error: 'No movie found'})

app.get('/', (req, res) => {
  res.send('<h1>Movie app</h1>')
})

app.get('/search-movies', async (req, res) => {
  const searchString = req.query.s
  const movies = await fetchMovies(searchString)
  movies.Response !== 'False'
    ? res.send(movies)
    : noMovieErrorResponse(res)
})

app.get('/movie', async (req, res) => {
  try {
    const movieSearchString = req.query.i
    const movie = await fetchMovie(movieSearchString)
    const movieObject = (({Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID}) => (
      {Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID}
    ))(movie)
    movie.Response !== 'False'
      ? res.send(movieObject)
      : noMovieErrorResponse(res)
  } catch(error) {
    noMovieErrorResponse(res)
  }
  
})

app.get('/review', async (req, res) => {
  const searchString = req.query.r
  const review = await fetchReview(searchString)
  const reviewResults = review.results && review.results[0]
  const reviewObject = reviewResults &&
    {
      display_title: reviewResults.display_title,
      headline: reviewResults.headline,
      summary: reviewResults.summary_short
    }
  reviewObject
    ? res.send(reviewObject)
    : res.status(404).send({error: 'No reviews found'})
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})