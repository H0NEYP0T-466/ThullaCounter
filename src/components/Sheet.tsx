import { useEffect, type ReactNode } from 'react'
import { Icon } from './Icon'

export function Sheet({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'default',
}: {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'default' | 'wide'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <div
        className={`sheet ${size === 'wide' ? 'sheet--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet__grab" aria-hidden="true" />
        <header className="sheet__head">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="sheet__body">{children}</div>
        {footer ? <footer className="sheet__foot">{footer}</footer> : null}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: ReactNode
  confirmLabel: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Sheet
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <div className="row-gap">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="confirm-body">{body}</div>
    </Sheet>
  )
}

export function Toast({
  message,
  actionLabel,
  onAction,
  onClose,
  tone = 'default',
}: {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
  tone?: 'default' | 'danger'
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, actionLabel ? 6000 : 2600)
    return () => window.clearTimeout(timer)
  }, [message, actionLabel, onClose])

  return (
    <div className={`toast ${tone === 'danger' ? 'toast--danger' : ''}`} role="status" aria-live="polite">
      <span className="toast__msg">{message}</span>
      {actionLabel && onAction ? (
        <button type="button" className="toast__action" onClick={onAction}>
          <Icon name="undo" size={14} />
          {actionLabel}
        </button>
      ) : null}
      <button type="button" className="toast__close" onClick={onClose} aria-label="Dismiss">
        <Icon name="close" size={14} />
      </button>
    </div>
  )
}
