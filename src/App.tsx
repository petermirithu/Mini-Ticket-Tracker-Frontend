import './App.css'

function App() {
  return (
    <div className="app-shell">      
      <main id="main">
        <section className="hero-section">
          <h1>Tickets</h1>
          <p className="hero-copy">Review and manage support tickets.</p>
        </section>
        
        <section className="tickets-section" aria-labelledby="tickets-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Queue</p>
              <h2 id="tickets-heading">All tickets</h2>
            </div>            
          </div>          
          
          <div className="state-panel empty-state">
            <span aria-hidden="true">✓</span>
            <h3>No tickets here</h3>
            <p>Create a ticket or choose a different status filter.</p>
          </div>
                            
        </section>
      </main>      
    </div>
  )
}

export default App
