import { useEffect, useState } from 'react'
import { getAllTickets, type Ticket } from './api'
import './App.css'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    </div>
  )
}

export default App
