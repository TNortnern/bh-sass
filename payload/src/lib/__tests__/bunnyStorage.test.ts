import { describe, it, expect } from 'vitest'
import { createBunnyStorageFromEnv } from '../bunnyStorage'

describe('Bunny Storage Configuration', () => {
  it('should create config from environment variables', () => {
    // Set up test environment
    process.env.BUNNY_STORAGE_ZONE = 'test-zone'
    process.env.BUNNY_API_KEY = 'test-key'
    process.env.BUNNY_CDN_URL = 'https://test.b-cdn.net'
    process.env.BUNNY_STORAGE_ENABLED = 'true'
    process.env.BUNNY_STORAGE_COLLECTIONS = 'media,assets'

    const config = createBunnyStorageFromEnv()

    expect(config.storageZone).toBe('test-zone')
    expect(config.apiKey).toBe('test-key')
    expect(config.cdnUrl).toBe('https://test.b-cdn.net')
    expect(config.enabled).toBe(true)
    expect(config.collections).toEqual(['media', 'assets'])
  })

  it('should have disabled as default', () => {
    // Clear environment
    delete process.env.BUNNY_STORAGE_ENABLED

    const config = createBunnyStorageFromEnv()

    expect(config.enabled).toBe(false)
  })

  it('should use media as default collection', () => {
    // Clear collection env var
    delete process.env.BUNNY_STORAGE_COLLECTIONS

    const config = createBunnyStorageFromEnv()

    expect(config.collections).toEqual(['media'])
  })
})
