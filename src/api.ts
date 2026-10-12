export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
}

export interface TicketPage {
  count: number
  next: string | null
  previous: string | null
  results: Ticket[]
}

export type CreateTicketInput = Pick<
  Ticket,
  'title' | 'description' | 'status' | 'priority'
>

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
)

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    try {
      const body = (await response.json()) as Record<string, unknown>
      const firstError = Object.values(body)[0]
      if (typeof firstError === 'string') message = firstError
      if (Array.isArray(firstError) && firstError.length) {
        message = String(firstError[0])
      }
    } catch {
      // Keep the user-friendly fallback for non-JSON errors.
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export function getTickets(status: TicketStatus | 'all', page: number, limit = 6) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status !== 'all') params.set('status', status)
  return request<TicketPage>(`/tickets?${params.toString()}`)
}

export function createTicket(ticket: CreateTicketInput) {
  return request<Ticket>('/tickets', {
    method: 'POST',
    body: JSON.stringify(ticket),
  })
}

export async function getAllTickets(): Promise<Ticket[]> {
  const tickets: Ticket[] = []
  let page = 1

  while (true) {
    const ticketPage = await getTickets('all', page, 100)
    tickets.push(...ticketPage.results)

    if (!ticketPage.next || ticketPage.results.length === 0) break
    page += 1
  }

  return tickets
}