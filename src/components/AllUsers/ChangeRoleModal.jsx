"use client"

const ChangeRoleModal = ({ user, newRole, setNewRole, closeModal, handleChangeRole }) => {
  const availableRoles = ["User", "Ict-expert", "Content-admin", "Admin"]

  return (
    <div className="modal-content">
      <p>Change role for user:</p>
      <p className="user-name">
        {user.firstName} {user.lastName}
      </p>
      <div className="role-selector">
        <label htmlFor="role">Select new role:</label>
        <select id="role" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div className="modal-footer">
        <button className="cancel-button" onClick={closeModal}>
          Cancel
        </button>
        <button className="confirm-button" onClick={handleChangeRole}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ChangeRoleModal


