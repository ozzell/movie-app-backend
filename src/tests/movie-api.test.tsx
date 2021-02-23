import app from '../../app'
import fetch from 'node-fetch'
import supertest from 'supertest'

const request = supertest(app)
jest.mock('node-fetch')

type FetchMock = typeof fetch & {
  mockResolvedValue: Function
}
const mockedFetch = fetch as FetchMock

describe('API: search-movies', () => {
  it('Should return list of movies', async () => {
    const title = 'tenet'
    mockedFetch.mockResolvedValue({
      ok: () => true,
      json: () => ({
        Search: [{
          Title: title
        }],
        Response: 'True'
      })
    })
    const response = await request.get(`/search-movies?s=${title}`)

    expect(response.status).toBe(200)
    const firstMovie = response.body.Search[0]
    expect(response.body.Response).toBe('True')
    expect(firstMovie.Title).toBe(title)
  })

  it('Should return error when no movieTitle provided as query', async () => {
    const title = ''
    const response = await request.get(`/search-movies?s=${title}`)

    expect(response.status).toBe(400)
    expect(JSON.parse(response.text)).toEqual({Error: 'No movieTitle provided'})
  })

  it('Should return error when the search term provided no results', async () => {
    const title = 'Not Made Movie'
    mockedFetch.mockResolvedValue({
      ok: () => true,
      json: () => (
        {
          Response: 'False',
          Error: 'Movie not found!'
        }
      )
    })
    const response = await request.get(`/search-movies?s=${title}`)

    expect(response.status).toBe(200)
    expect(JSON.parse(response.text)).toEqual({Error: 'Movie not found!', Response: 'False'})
  })
})
