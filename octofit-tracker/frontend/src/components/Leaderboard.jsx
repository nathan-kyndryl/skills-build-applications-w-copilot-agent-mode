import { useEffect, useState } from 'react'
import { fetchCollection } from '../App.jsx'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchCollection('leaderboard')
        setEntries(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Competition</p>
          <h2>Leaderboard</h2>
        </div>
        <span className="badge status-ok">{entries.length} ranked</span>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <div className="alert alert-light">Loading leaderboard...</div>
      ) : (
        <div className="table-wrap">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Athlete</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id ?? entry.user ?? entry.rank}>
                  <td>#{entry.rank}</td>
                  <td>{entry.user}</td>
                  <td>{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Leaderboard
