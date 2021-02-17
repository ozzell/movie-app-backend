export type Movies = {
  Response: string
}

export type Movie = {
  Actors?: string
  Director?: string
  Genre?: string
  Plot?: string
  Ratings?: []
  Title: string
  Writer?: string
  Year?: string
  imdbID: string
  Response: string
}

type ReviewResults = {
  // eslint-disable-next-line camelcase
  display_title?: string
  headline?: string
  // eslint-disable-next-line camelcase
  summary_short?: string
}

export type Review = {
  results: ReviewResults[]
}
