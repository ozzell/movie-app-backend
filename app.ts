import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import apicache from 'apicache'
import {fetchMovies, fetchMovie, fetchReview, HttpError} from './src/routes/movie-api'

const app: Application = express()
app.use(cors())
const cache = apicache.middleware
app.use(cache('5 minutes'))

const genericErrorResponse = (res: Response) => res.status(500).json({Error: 'Something went wrong'})
const apiErrorResponse = (res: Response, error: string, status: number) => res.status(status).json({Error: error})

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Movie app</h1>')
})

app.get('/search-movies', async (req: Request, res: Response) => {
  try {
    const searchString = req.query.s as string
    const movies = await fetchMovies(searchString)
    res.json(movies)
  } catch (error) {
    if (error instanceof HttpError) {
      apiErrorResponse(res, error.message, error.status)
    } else {
      genericErrorResponse(res)
    }
  }
})

app.get('/movie', async (req: Request, res: Response) => {
  try {
    const movieSearchString = req.query.i as string
    const movie = await fetchMovie(movieSearchString)
    const movieObject = (({Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID, Error}) => (
      {Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID, Error}
    ))(movie)
    res.json(movieObject)
  } catch (error) {
    if (error instanceof HttpError) {
      apiErrorResponse(res, error.message, error.status)
    } else {
      genericErrorResponse(res)
    }
  }
})

app.get('/review', async (req: Request, res: Response) => {
  try {
    const searchString = req.query.r as string
    const review = await fetchReview(searchString)
    const reviewResults = review.results && review.results[0]
    const reviewObject = reviewResults &&
      {
        display_title: reviewResults.display_title,
        headline: reviewResults.headline,
        summary: reviewResults.summary_short
      }

    reviewObject
      ? res.json(reviewObject)
      : res.status(404).json({Error: 'No reviews found'})
  } catch (error) {
    if (error instanceof HttpError) {
      apiErrorResponse(res, error.message, error.status)
    } else {
      genericErrorResponse(res)
    }
  }
})

export default app
