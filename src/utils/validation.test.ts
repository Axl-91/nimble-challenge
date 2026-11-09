import { describe, expect, it } from 'vitest'
import { isValidGitHubUrl } from './validation'

describe('isValidGitHubUrl', () => {
  it('accepts github.com repository URLs', () => {
    expect(isValidGitHubUrl('https://github.com/user/repository')).toBe(true)
  })

  it('accepts github.com subdomains', () => {
    expect(isValidGitHubUrl('https://gist.github.com/user/123')).toBe(true)
  })

  it('rejects non-GitHub URLs', () => {
    expect(isValidGitHubUrl('https://gitlab.com/user/repository')).toBe(false)
  })

  it('rejects invalid URLs', () => {
    expect(isValidGitHubUrl('not-a-url')).toBe(false)
  })
})
