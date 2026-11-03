import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('BrandGuard ErrorBoundary caught an unhandled error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a1117',
            color: '#edf4f5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              background: '#111b24',
              border: '1px solid #233b49',
              borderRadius: '16px',
              padding: '36px 30px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 147, 117, 0.14)',
                border: '1px solid #ff9375',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
                color: '#ff9375',
                fontSize: '24px'
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 10px', color: '#edf4f5' }}>
              BrandGuard Interface Recovered
            </h2>
            <p style={{ fontSize: '13px', color: '#889fae', lineHeight: 1.6, margin: '0 0 22px' }}>
              BrandGuard caught a client-side runtime situation and preserved your data. Click below to smoothly re-render your workspace.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                }}
                style={{
                  background: 'transparent',
                  color: '#edf4f5',
                  border: '1px solid #334b5c',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Dismiss &amp; Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.reload()
                }}
                style={{
                  background: '#baf57f',
                  color: '#0d171e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 22px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(186, 245, 127, 0.25)'
                }}
              >
                Reload Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
