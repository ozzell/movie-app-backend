import fetch from 'node-fetch'
import {Movies, Movie, Review} from './types'

const OMDB_URL = 'http://www.omdbapi.com/'
const NYT_URL = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json'

const fetchMovies = async (movieTitle: string): Promise<Movies> => {
  if (!movieTitle) {
    throw new Error('No movieTitle provided')
  }
  const searchUrl = `${OMDB_URL}?s=${movieTitle}&type=movie&apikey=${process.env.OMDB_API_KEY}`

  const response = await fetch(searchUrl)
  return response.json()
}

const fetchMovie = async (id: string): Promise<Movie> => {
  if (!id) {
    throw new Error('No id provided')
  }
  const oneMovieUrl = `${OMDB_URL}?i=${id}&apikey=${process.env.OMDB_API_KEY}`

  const response = await fetch(oneMovieUrl)
  return response.json()
}

const fetchReview = async (movieTitle: string): Promise<Review> => {
  if (!movieTitle) {
    throw new Error('No movieTitle provided')
  }
  const reviewUrl = `${NYT_URL}?query=${movieTitle}&api-key=${process.env.NYT_API_KEY}`
  const response = await fetch(reviewUrl)
  return response.json()
}

export {fetchMovies, fetchMovie, fetchReview}
