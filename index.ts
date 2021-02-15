import express, {Application, Request, Response} from 'express'
import {fetchMovies, fetchMovie, fetchReview} from './src/routes/movie-api'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app: Application = express()
app.use(cors())

const noMovieErrorResponse = (res: Response) => res.status(404).send({error: 'No movie found'})
const noSearchStringProvidedResponse = (res: Response) => res.status(400).send({error: 'No search string provided'})
const genericErrorResponse = (res: Response) => res.status(500).send({error: 'Something went wrong'})

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Movie app</h1>')
})

app.get('/search-movies', async (req: Request, res: Response) => {
  try {
    const searchString = req.query.s as string
    if (!searchString) {
      noSearchStringProvidedResponse(res)
    }
    const movies = await fetchMovies(searchString)
    movies.Response !== 'False'
      ? res.send(movies)
      : noMovieErrorResponse(res)
  } catch (error) {
    genericErrorResponse(res)
  }
})

app.get('/movie', async (req: Request, res: Response) => {
  try {
    const movieSearchString = req.query.i as string
    if (!movieSearchString) {
      noSearchStringProvidedResponse(res)
    }
    const movie = await fetchMovie(movieSearchString)
    const movieObject = (({Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID}) => (
      {Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID}
    ))(movie)
    movie.Response !== 'False'
      ? res.send(movieObject)
      : noMovieErrorResponse(res)
  } catch (error) {
    genericErrorResponse(res)
  }
})

app.get('/review', async (req: Request, res: Response) => {
  try {
    const searchString = req.query.r as string
    if (!searchString) {
      noSearchStringProvidedResponse(res)
    }
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
  } catch (error) {
    genericErrorResponse(res)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
