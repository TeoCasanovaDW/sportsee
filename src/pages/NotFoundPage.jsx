import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 — Page introuvable</h1>
      <Link to="/login">Retour à la connexion</Link>
    </div>
  )
}
