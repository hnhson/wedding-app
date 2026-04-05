import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateName } from './validation'

describe('validateEmail', () => {
  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email là bắt buộc')
  })
  it('returns error for invalid format', () => {
    expect(validateEmail('notanemail')).toBe('Email không hợp lệ')
  })
  it('returns null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull()
  })
})

describe('validatePassword', () => {
  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Mật khẩu là bắt buộc')
  })
  it('returns error for password shorter than 8 chars', () => {
    expect(validatePassword('abc123')).toBe('Mật khẩu phải có ít nhất 8 ký tự')
  })
  it('returns null for valid password', () => {
    expect(validatePassword('securepassword')).toBeNull()
  })
})

describe('validateName', () => {
  it('returns error for empty name', () => {
    expect(validateName('')).toBe('Tên là bắt buộc')
  })
  it('returns null for valid name', () => {
    expect(validateName('An Nguyen')).toBeNull()
  })
})
