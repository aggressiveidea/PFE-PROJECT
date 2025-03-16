"use client"

const DeleteModal = ({ user, closeModal, handleDeleteUser }) => {
  return (
    <div className="modal-content">
      <p>Are you sure you want to delete this user?</p>
      <p className="user-name">
        {user.firstName} {user.lastName}
      </p>
      <p className="warning">This action cannot be undone.</p>
      <div className="modal-footer">
        <button className="cancel-button" onClick={closeModal}>
          Cancel
        </button>
        <button className="confirm-button delete" onClick={handleDeleteUser}>
          Delete User
        </button>
      </div>
    </div>
  )
}

export default DeleteModal

