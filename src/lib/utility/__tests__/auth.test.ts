import { getAuthCredentialsHeaders } from '../auth'

describe('auth', () => {
  it('returns a headers authorization object when passed a token', () => {
    const fakeToken = 'some-token-here'
    const result = getAuthCredentialsHeaders(fakeToken)

    expect(result).toHaveProperty('headers')
    expect(result.headers).toHaveProperty('Authorization', fakeToken)
  })

  it('returns cookie auth when no token is provided', () => {
    const result = getAuthCredentialsHeaders()

    expect(result).toHaveProperty('withCredentials', true)
  })
})
