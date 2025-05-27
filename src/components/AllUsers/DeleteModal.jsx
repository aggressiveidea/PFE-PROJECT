const DeleteModal = ({ user, closeModal, handleDeleteUser }) => {
  return (
    <div className="usermanagement-modal-content">
      <p>Are you sure you want to delete this user?</p>
      <p className="usermanagement-user-name">
        {user.firstName} {user.lastName}
      </p>
      <p className="usermanagement-warning">This action cannot be undone</p>
      <div className="usermanagement-modal-footer">
        <button className="usermanagement-cancel-btn" onClick={closeModal}>
          Cancel
        </button>
        <button className="usermanagement-confirm-btn delete" onClick={handleDeleteUser}>
          Delete User
        </button>
      </div>
    </div>
  )
}

export default DeleteModal


