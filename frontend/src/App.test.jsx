import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  document.body.innerHTML = ''
  sessionStorage.clear()
  localStorage.clear()
})

beforeEach(() => {
  sessionStorage.setItem('brandguard_access_token', 'test-token')
})

describe('BrandGuard review workspace', () => {
  it('loads the seeded review queue and findings', async () => {
    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading review workspace')
    expect(await screen.findByRole('heading', { name: 'CarePlus Diwali campaign' })).toBeVisible()
    expect(screen.getAllByText(/Unsupported claim/).length).toBeGreaterThan(0)
  })

  it('supports keyboard closing and validation in the new review dialog', async () => {
    render(<App />)
    await screen.findByRole('heading', { name: 'CarePlus Diwali campaign' })

    fireEvent.click(screen.getByRole('button', { name: /new review/i }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Content title' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: /run brand check/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Add a title and draft copy')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('BrandGuard authentication', () => {
  it('blocks sign in until human verification is completed', async () => {
    sessionStorage.clear()
    render(<App />)

    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'test@careplus.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: /continue with email/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Complete the human verification first')
    expect(screen.getByRole('heading', { name: 'Welcome to BrandGuard AI' })).toBeVisible()
  })

  it('renders the secure login experience when signed out', async () => {
    sessionStorage.clear()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Welcome to BrandGuard AI' })).toBeVisible()
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'test@careplus.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password' } })
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Continue with Microsoft' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Continue with GitHub' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: /i'm not a robot/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue with email/i }))

    expect(await screen.findByRole('heading', { name: 'CarePlus Diwali campaign' })).toBeVisible()
    expect(screen.getByRole('button', { name: /approval restricted/i })).toBeDisabled()
  })

  it('opens and completes the sign-up flow after human verification', async () => {
    sessionStorage.clear()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    const dialog = screen.getByRole('dialog', { name: 'Create your BrandGuard account' })
    fireEvent.change(within(dialog).getByPlaceholderText('Priyansh Vaghela'), { target: { value: 'Test User' } })
    fireEvent.change(within(dialog).getByPlaceholderText('you@company.com'), { target: { value: 'test@example.com' } })
    fireEvent.change(within(dialog).getByPlaceholderText('CarePlus Health'), { target: { value: 'CarePlus Health' } })
    fireEvent.change(within(dialog).getByPlaceholderText('Brand manager'), { target: { value: 'Content creator' } })
    fireEvent.change(within(dialog).getByPlaceholderText('Marketing'), { target: { value: 'Creative' } })
    fireEvent.change(within(dialog).getByPlaceholderText('CP-1042'), { target: { value: 'CP-1042' } })
    fireEvent.change(within(dialog).getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } })
    fireEvent.change(within(dialog).getByPlaceholderText('Repeat your password'), { target: { value: 'password123' } })
    fireEvent.click(within(dialog).getByRole('button', { name: /i'm not a robot/i }))
    fireEvent.click(within(dialog).getByRole('button', { name: /create account/i }))

    expect(await screen.findByRole('heading', { name: 'Check your inbox' })).toBeVisible()
  })
})
