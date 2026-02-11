import { captureClientError } from './sentry'

export type ErrorContext = {
  source: 'error-boundary' | 'window.error' | 'unhandledrejection'
  componentStack?: string
  metadata?: Record<string, unknown>
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value)
  } catch {
    return '[unserializable]'
  }
}

function toErrorPayload(error: unknown, context: ErrorContext) {
  const err = error instanceof Error ? error : new Error(String(error))

  return {
    message: err.message,
    name: err.name,
    stack: err.stack,
    source: context.source,
    componentStack: context.componentStack,
    metadata: context.metadata,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  }
}

export function reportClientError(error: unknown, context: ErrorContext) {
  const payload = toErrorPayload(error, context)

  // Always keep local visibility while we wire production destination.
  console.error('[monitoring] client error', payload)

  captureClientError(error, context, payload)

  // Optional endpoint for future ingestion (e.g. Vercel function -> Sentry/Logtail/etc).
  const endpoint = import.meta.env.VITE_CLIENT_ERROR_ENDPOINT
  if (!endpoint) return

  const body = safeStringify(payload)

  if ('sendBeacon' in navigator) {
    navigator.sendBeacon(endpoint, body)
    return
  }

  void fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  })
}

export function setupGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    reportClientError(event.error ?? event.message, {
      source: 'window.error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportClientError(event.reason, {
      source: 'unhandledrejection',
    })
  })
}
