import { useEffect, useState } from 'react'
import { fetchCollection, getApiBaseUrl } from '../App.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const workoutsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : `${getApiBaseUrl()}/api/workouts/`

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await fetchCollection('workouts', workoutsApiUrl)
        setWorkouts(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()
  }, [])

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Plans</p>
          <h2>Workouts</h2>
        </div>
        <span className="badge status-ok">{workouts.length} routines</span>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <div className="alert alert-light" role="status">Loading workouts...</div>
      ) : (
        <div className="table-wrap">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              {workouts.length ? workouts.map((workout) => (
                <tr key={workout.id ?? workout.title}>
                  <td>{workout.title}</td>
                  <td><span className="badge">{workout.difficulty}</span></td>
                  <td>{workout.duration} min</td>
                  <td>{workout.focus ?? 'General'}</td>
                </tr>
              )) : (
                <tr><td colSpan="4">No workouts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Workouts
