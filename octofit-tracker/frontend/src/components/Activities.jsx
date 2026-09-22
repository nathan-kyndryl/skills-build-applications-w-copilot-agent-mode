import { useEffect, useState } from 'react'
import { fetchCollection, getApiBaseUrl } from '../App.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const activitiesApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : `${getApiBaseUrl()}/api/activities/`

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchCollection('activities', activitiesApiUrl)
        setActivities(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tracking</p>
          <h2>Activities</h2>
        </div>
        <span className="badge status-ok">{activities.length} records</span>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <div className="alert alert-light" role="status">Loading activities...</div>
      ) : (
        <div className="table-wrap">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.length ? activities.map((activity) => (
                <tr key={activity.id ?? `${activity.type}-${activity.date}`}>
                  <td>{activity.type}</td>
                  <td>{activity.duration} min</td>
                  <td>{activity.calories}</td>
                  <td>{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              )) : (
                <tr><td colSpan="4">No activities found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities
