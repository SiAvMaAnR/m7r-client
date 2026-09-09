import PropTypes from 'prop-types'
import ToolsIcon from '../../common/Icon/ToolsIcon/ToolsIcon'
import DropDown from '../../common/DropDown/DropDown'
import { activityStatus } from '../../../constants/system'
import api from '../../../api/api'
import UnblockIcon from '../../common/Icon/UnblockIcon/UnblockIcon'
import BlockIcon from '../../common/Icon/BlockIcon/BlockIcon'
import Avatar from '../../common/Avatar/Avatar'
import StatusBadge from './StatusBadge/StatusBadge'
import './UserItem.scss'

function UserItem({ className = '', userInfo = null, loadUsers = null }) {
  const { id, login, email, birthday, activityStatus: status, isBanned, imageId } = userInfo
  const isOnline = status.toLowerCase() === activityStatus.online
  const bannedClass = isBanned ? 'yes' : ''
  const dropDownItems = [
    isBanned
      ? {
          icon: <UnblockIcon className="dropdown-icon" />,
          title: 'Unblock',
          onClick: () => {
            api.user.unblockUser({ id }).then(() => loadUsers())
          }
        }
      : {
          icon: <BlockIcon className="dropdown-icon" />,
          title: 'Block',
          onClick: () => {
            api.user.blockUser({ id }).then(() => loadUsers())
          }
        }
  ]

  return (
    <tr className={`c-user-item ${className}`}>
      <td className="image" aria-label={login}>
        <Avatar imageId={imageId} name={login} />
      </td>
      <td className="cell-id">{id}</td>
      <td className="email">{email}</td>
      <td className="login">{login}</td>
      <td className="birthday">{birthday}</td>
      <td className="activity-status" aria-label={status}>
        <StatusBadge status={status} isOnline={isOnline} />
      </td>
      <td className={`banned ${bannedClass}`}>
        <span className="banned-badge">{isBanned ? 'Banned' : 'Active'}</span>
      </td>
      <td className="tools">
        <DropDown items={dropDownItems} className="bottom">
          <ToolsIcon className="tools-icon" aria-label="tools" />
        </DropDown>
      </td>
    </tr>
  )
}

UserItem.propTypes = {
  className: PropTypes.string,
  userInfo: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    imageId: PropTypes.string,
    birthday: PropTypes.string,
    activityStatus: PropTypes.string,
    isBanned: PropTypes.bool
  }),
  loadUsers: PropTypes.func
}

export default UserItem
