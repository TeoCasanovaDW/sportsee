import { useState, useEffect } from 'react'
import { getUserActivity } from '../services/api'

function getFourWeekBounds() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const startMonday = new Date(monday)
  startMonday.setDate(monday.getDate() - 21)
  return {
    startWeek: startMonday.toISOString().slice(0, 10),
    endWeek: sunday.toISOString().slice(0, 10),
  }
}

function normalize(data, startWeek, endWeek) {
  const sessions = Array.isArray(data) ? data : []
  return {
    sessions: sessions.map((s) => ({
      date: s.date ?? '',
      distance: s.distance ?? 0,
      heartRate: {
        average: s.heartRate?.average ?? 0,
        min: s.heartRate?.min ?? 0,
        max: s.heartRate?.max ?? 0,
      },
      duration: s.duration ?? 0,
      caloriesBurned: s.caloriesBurned ?? 0,
    })),
    weeklyStats: {
      sessionsCount: sessions.length,
      totalDuration: sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0),
      totalDistance: sessions.reduce((sum, s) => sum + (s.distance ?? 0), 0),
    },
    period: {
      startWeek: startWeek ?? '',
      endWeek: endWeek ?? '',
    },
  }
}

export function useUserActivity(startWeek, endWeek) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const bounds = getFourWeekBounds()
  const start = startWeek ?? bounds.startWeek
  const end = endWeek ?? bounds.endWeek

  useEffect(() => {
    setLoading(true)
    setError(null)
    getUserActivity(start, end)
      .then((raw) => setData(normalize(raw, start, end)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [start, end])

  return { data, loading, error }
}
