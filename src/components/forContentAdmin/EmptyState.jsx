import { FileText } from "lucide-react"

export default function EmptyState({ icon = <FileText size={48} />, title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

