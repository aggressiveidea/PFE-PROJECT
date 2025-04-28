"use client"
import DeleteModal from "./DeleteModal"
import ChangeRoleModal from "./ChangeRoleModal"

const Modal = ({
  isOpen,
  modalType,
  selectedUser,
  newRole,
  setNewRole,
  closeModal,
  handleDeleteUser,
  handleChangeRole,
}) => {
  if (!isOpen) return null

  return (
    <div className="usermanagement-modal-overlay">
      <div className="usermanagement-modal">
        <div className="usermanagement-modal-header">
          <h3>{modalType === "delete" ? "Delete User" : "Change User Role"}</h3>
          <button className="usermanagement-close-btn" onClick={closeModal}>
            ×
          </button>
        </div>

        {modalType === "delete" ? (
          <DeleteModal user={selectedUser} closeModal={closeModal} handleDeleteUser={handleDeleteUser} />
        ) : (
          <ChangeRoleModal
            user={selectedUser}
            newRole={newRole}
            setNewRole={setNewRole}
            closeModal={closeModal}
            handleChangeRole={handleChangeRole}
          />
        )}
      </div>
    </div>
  )
}

export default Modal
