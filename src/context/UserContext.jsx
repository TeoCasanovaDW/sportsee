import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getUserInfo } from '../services/api'

const UserContext = createContext(null)

function normalizeUserInfo(data) {
  const p = data.profile ?? data
  const s = data.statistics ?? data.stats ?? {}
  return {
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    memberSince: p.createdAt ?? p.memberSince ?? '',
    age: p.age ?? null,
    height: p.height ?? null,
    weight: p.weight ?? null,
    profilePicture: p.profilePicture ?? '',
    stats: {
      totalDistance: parseFloat(s.totalDistance) || 0,
      totalDuration: s.totalDuration ?? 0,
      sessionsCount: s.totalSessions ?? s.sessionsCount ?? 0,
    },
  }
}

export function UserProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setUserInfo(null)
      setError(null)
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
