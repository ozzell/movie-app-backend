const fetch = require('node-fetch')
const OMDB_URL = 'http://www.omdbapi.com/'
const NYT_URL =
  `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=interstellar&api-key=${process.env.NYT_API_KEY}`

const fetchMovies = async movieTitle => {
  if (!movieTitle) {
    return
  }
  const searchUrl = `${OMDB_URL}?s=${movieTitle}&type=movie&apikey=${process.env.OMDB_API_KEY}`

  const response = await fetch(searchUrl)
  return response.json()
}

const fetchMovie = async id => {
  if (!id) {
    return
  }
  const oneMovieUrl = `${OMDB_URL}?i=${id}&apikey=${process.env.OMDB_API_KEY}`

  const response = await fetch(oneMovieUrl)
  return response.json()
}

const fetchReview = async movieTitle => {
  if (!movieTitle) {
    return
  }
  const response = await fetch(NYT_URL)
  return response.json()
}

module.exports = {fetchMovies, fetchMovie, fetchReview}