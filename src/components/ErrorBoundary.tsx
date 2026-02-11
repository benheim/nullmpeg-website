import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportClientError } from '../monitoring/errorLogger'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportClientError(error, {
      source: 'error-boundary',
      componentStack: info.componentStack ?? undefined,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem',
            textAlign: 'center',
            color: '#fff',
            background: '#000',
          }}
        >
          <div>
            <h1 style={{ marginBottom: '0.75rem' }}>signal interrupted</h1>
            <p style={{ opacity: 0.8 }}>Something broke. We logged it and will investigate.</p>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
