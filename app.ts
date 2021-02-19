import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import {fetchMovies, fetchMovie, fetchReview, HttpError} from './src/routes/movie-api'

const app: Application = express()
app.use(cors())

const noSearchStringProvidedResponse = (res: Response) => res.status(400).send({Error: 'No search string provided'})
const genericErrorResponse = (res: Response) => res.status(500).send({Error: 'Something went wrong'})
const apiErrorResponse = (res: Response, error: string, status: number) => res.status(status).send({Error: error})

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Movie app</h1>')
})

app.get('/search-movies', async (req: Request, res: Response) => {
  try {
    const searchString = req.query.s as string
    if (!searchString) {
      noSearchStringProvidedResponse(res)
      return
    }

    const movies = await fetchMovies(searchString)
    res.send(movies)
  } catch (error) {
    if (error instanceof HttpError) {
      apiErrorResponse(res, error.message, error.status)
    }
    genericErrorResponse(res)
  }
})

app.get('/movie', async (req: Request, res: Response) => {
  try {
    const movieSearchString = req.query.i as string
    if (!movieSearchString) {
      noSearchStringProvidedResponse(res)
      return
    }

    const movie = await fetchMovie(movieSearchString)
    const movieObject = (({Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID, Error}) => (
      {Title, Year, Genre, Director, Writer, Actors, Plot, Ratings, imdbID, Error}
    ))(movie)
    res.send(movieObject)
  } catch (error) {
    if (error instanceof HttpError) {
      apiErrorResponse(res, error.message, error.status)
    }
    genericErrorResponse(res)
  }
})

app.get('/review', async (req: Request, res: Response) => {
  try {
    const searchString = req.query.r as string
    if (!searchString) {
      noSearchStringProvidedResponse(res)
      return
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
    if (error instanceof HttpError) {
      apiErrorResponse(res, error.message, error.status)
    }
    genericErrorResponse(res)
  }
})

export default app
