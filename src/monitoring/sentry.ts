import * as Sentry from '@sentry/react'
import type { ErrorContext } from './errorLogger'

const dsn = import.meta.env.VITE_SENTRY_DSN

let initialized = false

export function initSentry() {
  if (!dsn || initialized) return

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
    release: import.meta.env.VITE_APP_RELEASE,
    // Keep this lightweight for a simple landing page.
    tracesSampleRate: 0,
  })

  initialized = true
}

export function captureClientError(error: unknown, context: ErrorContext, payload: Record<string, unknown>) {
  if (!dsn) return

  const normalized = error instanceof Error ? error : new Error(String(error))

  Sentry.withScope((scope) => {
    scope.setTag('error_source', context.source)

    if (context.componentStack) {
      scope.setContext('react', { componentStack: context.componentStack })
    }

    if (context.metadata) {
      scope.setContext('metadata', context.metadata)
    }

    scope.setContext('client_payload', payload)
    Sentry.captureException(normalized)
  })
}
