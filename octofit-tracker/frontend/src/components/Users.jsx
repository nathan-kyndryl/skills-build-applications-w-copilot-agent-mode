import { useEffect, useState } from 'react'
import { fetchCollection } from '../App.jsx'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchCollection('users')
        setUsers(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Members</p>
          <h2>Users</h2>
        </div>
        <span className="badge status-ok">{users.length} total</span>
      </div>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : null}

      {loading ? (
        <div className="alert alert-light">Loading users...</div>
      ) : (
        <div className="table-wrap">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id ?? user.email ?? user.name}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.team}</td>
                  <td><span className="badge">{user.level ?? 'N/A'}</span></td>
                  <td>
                    <span className={`badge ${user.active ? 'status-ok' : 'status-warn'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Users
