import { useEffect, useState, type FormEvent } from 'react'
import {
  createTicket,
  getAllTickets,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from './api'
import './App.css'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    getAllTickets()
      .then((result) => {
        if (isActive) setTickets(result)
      })
      .catch((reason: unknown) => {
        if (isActive) {
          setError(reason instanceof Error ? reason.message : 'Unable to load tickets.')
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsCreating(true)
    setFormError(null)

    const form = new FormData(event.currentTarget)

    try {
      const ticket = await createTicket({
        title: String(form.get('title')),
        description: String(form.get('description')),
        status: String(form.get('status')) as TicketStatus,
        priority: String(form.get('priority')) as TicketPriority,
      })
      setTickets((current) => [ticket, ...current])
      setIsFormOpen(false)
    } catch (reason: unknown) {
      setFormError(reason instanceof Error ? reason.message : 'Unable to create ticket.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="app-shell">
      <main id="main">
        <section className="hero-section">
          <h1>Tickets</h1>
          <p className="hero-copy">Review and manage support tickets.</p>
        </section>

        <section aria-labelledby="tickets-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Queue</p>
              <h2 id="tickets-heading">All tickets</h2>
            </div>
            <button className="button" type="button" onClick={() => setIsFormOpen(true)}>
              New ticket
            </button>
          </div>

          {isLoading && <div className="state-panel">Loading tickets…</div>}

          {!isLoading && error && (
            <div className="state-panel error-state" role="alert">
              {error}
            </div>
          )}

          {!isLoading && !error && tickets.length === 0 && (
            <div className="state-panel empty-state">
              <span aria-hidden="true">✓</span>
              <h3>No tickets here</h3>
              <p>Create a ticket to get started.</p>
            </div>
          )}

          {!isLoading && !error && tickets.length > 0 && (
            <div className="table-container">
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="ticket-title">{ticket.title}</td>
                      <td>{ticket.description}</td>
                      <td>
                        <span className={`status-badge status-${ticket.status}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`priority priority-${ticket.priority}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <time dateTime={ticket.created_at}>
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: 'medium',
                          }).format(new Date(ticket.created_at))}
                        </time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-ticket-heading"
          >
            <div className="modal-heading">
              <h2 id="create-ticket-heading">Create ticket</h2>
              <button
                className="close-button"
                type="button"
                aria-label="Close"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <label>
                Title
                <input name="title" type="text" required maxLength={200} autoFocus />
              </label>

              <label>
                Description
                <textarea name="description" required rows={4} />
              </label>

              <div className="form-row">
                <label>
                  Status
                  <select name="status" defaultValue="open">
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select name="priority" defaultValue="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>

              {formError && <p className="form-error" role="alert">{formError}</p>}

              <div className="form-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button className="button" type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating…' : 'Create ticket'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
