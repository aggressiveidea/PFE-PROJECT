import UserCard from "./UserCard"
import "./user-management.css"
const UserList = ({ filteredUsers, openModal }) => {
  return (
    <div className="users-grid">
      {filteredUsers.map((user, index) => (
        <UserCard key={user.id} user={user} index={index} openModal={openModal} />
      ))}
      {filteredUsers.length === 0 && (
        <div className="no-results">
          <h3>No users found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default UserList

