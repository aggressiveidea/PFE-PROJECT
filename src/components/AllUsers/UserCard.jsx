"use client"
import { DeleteIcon, RoleIcon } from "./Icons"
import "./user-management.css"
const UserCard = ({ user, index, openModal }) => {
  const getAnimationDelay = (index) => {
    return { animationDelay: `${0.1 + index * 0.1}s` }
  }

  return (
    <div className="user-card" style={getAnimationDelay(index)}>
      <div className="user-card-header">
        <div className="user-avatar">
          <img src={user.profilePic || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
        </div>
        <div className="user-info">
          <h3>
            {user.firstName} {user.lastName}
          </h3>
          <p className="user-email">{user.email}</p>
          <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
        </div>
      </div>
      <div className="user-actions">
        <button className="action-button edit-role" onClick={() => openModal("changeRole", user)}>
          <RoleIcon /> Change Role
        </button>
        <button className="action-button delete" onClick={() => openModal("delete", user)}>
          <DeleteIcon /> Delete User
        </button>
      </div>
    </div>
  )
}

export default UserCard

