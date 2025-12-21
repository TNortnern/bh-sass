import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authLoginEndpoint } from '../../../src/endpoints/auth-login'
import { generatePayloadCookie, headersWithCors, loginOperation } from 'payload'

vi.mock('payload', () => ({
  generatePayloadCookie: vi.fn(),
  headersWithCors: vi.fn(({ headers }) => headers),
  loginOperation: vi.fn()
}))

const baseAuthConfig = {
  cookies: { sameSite: 'Lax', secure: false, domain: undefined },
  tokenExpiration: 7 * 24 * 60 * 60,
  loginWithUsername: false,
  removeTokenFromResponses: false
}

function createRequest(body: Record<string, unknown>, authConfig = baseAuthConfig) {
  return {
    payload: {
      collections: {
        users: {
          slug: 'users',
          config: {
            auth: authConfig
          }
        }
      },
      config: { cookiePrefix: 'payload' }
    },
    json: vi.fn().mockResolvedValue(body),
    searchParams: new URL('https://test.local/auth/login').searchParams,
    t: (key: string) => key
  } as any
}

beforeEach(() => {
  vi.clearAllMocks()
  delete process.env.REMEMBER_ME_TOKEN_EXPIRATION
  delete process.env.REMEMBER_ME_DAYS
})

describe('authLoginEndpoint', () => {
  it('returns 500 when users auth is not configured', async () => {
    const req = createRequest({ email: 'test@example.com', password: 'pass' }, undefined as any)
    req.payload.collections.users.config.auth = undefined

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.errors?.[0]?.message).toContain('Authentication is not configured')
  })

  it('returns 400 when email is missing', async () => {
    const req = createRequest({ password: 'pass' })

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.errors?.[0]?.message).toBe('Email is required')
  })

  it('returns 400 when email is empty string', async () => {
    const req = createRequest({ email: '  ', password: 'pass' })

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.errors?.[0]?.message).toBe('Email is required')
  })

  it('returns 400 when password is missing', async () => {
    const req = createRequest({ email: 'test@example.com' })

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.errors?.[0]?.message).toBe('Password is required')
  })

  it('returns 400 when password is empty string', async () => {
    const req = createRequest({ email: 'test@example.com', password: '' })

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.errors?.[0]?.message).toBe('Password is required')
  })

  it('uses default token expiration when rememberMe is false', async () => {
    vi.mocked(loginOperation).mockResolvedValue({
      token: 'token-123',
      user: { id: 'user-1' }
    } as any)
    vi.mocked(generatePayloadCookie).mockReturnValue('payload-token=token-123')

    const req = createRequest({
      email: 'test@example.com',
      password: 'pass',
      rememberMe: false
    })

    const response = await authLoginEndpoint.handler(req)

    expect(response.status).toBe(200)
    const loginArgs = vi.mocked(loginOperation).mock.calls[0]?.[0]
    expect(loginArgs.collection.config.auth.tokenExpiration).toBe(baseAuthConfig.tokenExpiration)
    expect(response.headers.get('set-cookie')).toBe('payload-token=token-123')
  })

  it('uses remember-me expiration from seconds env override', async () => {
    process.env.REMEMBER_ME_TOKEN_EXPIRATION = '2592000'
    vi.mocked(loginOperation).mockResolvedValue({
      token: 'token-456',
      user: { id: 'user-2' }
    } as any)
    vi.mocked(generatePayloadCookie).mockReturnValue('payload-token=token-456')

    const req = createRequest({
      email: 'test@example.com',
      password: 'pass',
      rememberMe: true
    })

    await authLoginEndpoint.handler(req)

    const loginArgs = vi.mocked(loginOperation).mock.calls[0]?.[0]
    expect(loginArgs.collection.config.auth.tokenExpiration).toBe(2592000)
  })

  it('uses remember-me expiration from days env override when seconds is unset', async () => {
    process.env.REMEMBER_ME_DAYS = '45'
    vi.mocked(loginOperation).mockResolvedValue({
      token: 'token-789',
      user: { id: 'user-3' }
    } as any)
    vi.mocked(generatePayloadCookie).mockReturnValue('payload-token=token-789')

    const req = createRequest({
      email: 'test@example.com',
      password: 'pass',
      rememberMe: true
    })

    await authLoginEndpoint.handler(req)

    const loginArgs = vi.mocked(loginOperation).mock.calls[0]?.[0]
    expect(loginArgs.collection.config.auth.tokenExpiration).toBe(45 * 24 * 60 * 60)
  })

  it('removes token from response when configured', async () => {
    vi.mocked(loginOperation).mockResolvedValue({
      token: 'token-000',
      user: { id: 'user-4' }
    } as any)
    vi.mocked(generatePayloadCookie).mockReturnValue('payload-token=token-000')

    const req = createRequest(
      {
        email: 'test@example.com',
        password: 'pass',
        rememberMe: true
      },
      {
        ...baseAuthConfig,
        removeTokenFromResponses: true
      }
    )

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(data.token).toBeUndefined()
  })

  it('returns status from thrown errors with message', async () => {
    vi.mocked(loginOperation).mockRejectedValue({
      statusCode: 401,
      message: 'Invalid email or password'
    })

    const req = createRequest({
      email: 'test@example.com',
      password: 'bad',
      rememberMe: false
    })

    const response = await authLoginEndpoint.handler(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.errors?.[0]?.message).toBe('Invalid email or password')
  })
})
