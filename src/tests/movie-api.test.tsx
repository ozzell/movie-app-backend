import app from '../../app'
import fetch from 'node-fetch'

const supertest = require('supertest')

const api = supertest(app)
jest.mock('node-fetch')

type FetchMock = typeof fetch & {
  mockResolvedValue: Function
}
const mockedFetch = fetch as FetchMock

describe('API: search-movies', () => {
  it('Should return list of movies', async () => {
    const title = 'tenet'
    mockedFetch.mockResolvedValue({
      json: () => ({
        Search: [{
          Title: title
        }],
        Response: 'True'
      })
    })
    const response = await api.get(`/search-movies?s=${title}`)

    expect(response.status).toBe(200)
    const firstMovie = response.body.Search[0]
    expect(response.body.Response).toBe('True')
    expect(firstMovie.Title).toBe(title)
  })

  it('Should return error when no search string provided', async () => {
    const title = ''
    const response = await api.get(`/search-movies?s=${title}`)

    expect(response.status).toBe(400)
    expect(JSON.parse(response.text)).toEqual({error: 'No search string provided'})
  })

  it('Should return error when the search term provided no results', async () => {
    const title = 'Not Made Movie'
    mockedFetch.mockResolvedValue({
      json: () => (
        {
          Response: 'False'
        }
      )
    })
    const response = await api.get(`/search-movies?s=${title}`)

    expect(response.status).toBe(404)
    expect(JSON.parse(response.text)).toEqual({error: 'No movie found'})
  })
})
