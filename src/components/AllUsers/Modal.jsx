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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modalType === "delete" ? "Delete User" : "Change User Role"}</h3>
          <button className="close-button" onClick={closeModal}>
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

