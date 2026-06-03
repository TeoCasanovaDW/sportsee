import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getUserInfo } from '../services/api'

const UserContext = createContext(null)

function normalizeUserInfo(data) {
  const p = data.profile ?? data
  const s = data.statistics ?? {}
  const firstName = p.firstName ?? '—'
  const lastName = p.lastName ?? ''
  return {
    firstName,
    lastName,
    fullName: lastName ? `${firstName} ${lastName}` : firstName,
    memberSince: p.createdAt ?? p.memberSince ?? null,
    age: p.age ?? '—',
    height: p.height ?? '—',
    weight: p.weight ?? '—',
    profilePicture: p.profilePicture ?? '',
    gender: p.gender == null ? '—' : p.gender === 'female' ? 'Femme' : 'Homme',
    stats: {
      totalDistance: s.totalDistance != null ? parseFloat(s.totalDistance) : '—',
      totalDuration: s.totalDuration ?? 0,
      sessionsCount: s.totalSessions ?? s.sessionsCount ?? '—',
    },
    weeklyGoal: data.weeklyGoal ?? '—',
  }
}

export function UserProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setUserInfo(null)
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    async function fetchAll() {
      try {
        const infoRaw = await getUserInfo()
        setUserInfo(normalizeUserInfo(infoRaw))
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }

    fetchAll()
  }, [isAuthenticated])

  return (
    <UserContext.Provider value={{ userInfo, loading, error }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
