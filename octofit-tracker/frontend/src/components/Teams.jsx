import { useEffect, useState } from 'react'
import { fetchCollection, getApiBaseUrl } from '../App.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const teamsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : `${getApiBaseUrl()}/api/teams/`

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchCollection('teams', teamsApiUrl)
        setTeams(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [])

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Groups</p>
          <h2>Teams</h2>
        </div>
        <span className="badge status-ok">{teams.length} teams</span>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <div className="alert alert-light" role="status">Loading teams...</div>
      ) : (
        <div className="table-wrap">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Focus</th>
                <th>Members</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {teams.length ? teams.map((team) => (
                <tr key={team.id ?? team.name}>
                  <td>{team.name}</td>
                  <td><span className="badge">{team.focus}</span></td>
                  <td>{team.members}</td>
                  <td>{team.description ?? 'Training group'}</td>
                </tr>
              )) : (
                <tr><td colSpan="4">No teams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Teams
