const BASE_URL = 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const message = `HTTP ${response.status}: ${response.statusText}`
    throw new Error(message)
  }
  return response.json()
}

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse(response)
}

export async function getUserInfo() {
  const response = await fetch(`${BASE_URL}/api/user-info`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function getUserActivity(startWeek, endWeek) {
  const params = new URLSearchParams({ startWeek, endWeek })
  const response = await fetch(`${BASE_URL}/api/user-activity?${params}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function getProfileImage() {
  const response = await fetch(`${BASE_URL}/api/profile-image`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}
