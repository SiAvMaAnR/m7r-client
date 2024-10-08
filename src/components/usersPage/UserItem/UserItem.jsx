import PropTypes from 'prop-types'
import ToolsIcon from './ToolsIcon/ToolsIcon'
import DropDown from '../../common/DropDown/DropDown'
import { activityStatus } from '../../../constants/system'
import api from '../../../api/api'
import UnblockIcon from './DropDownIcons/Unblock/UnblockIcon'
import BlockIcon from './DropDownIcons/BlockIcon/BlockIcon'
import config from '../../../config/configuration'
import ImgWrapper from '../../common/ImgWrapper/ImgWrapper'
import './UserItem.scss'

function UserItem({ className = '', userInfo = null, loadUsers = null }) {
  const { id, login, email, birthday, activityStatus: status, isBanned, image } = userInfo
  const activityStatusClass = status.toLowerCase() === activityStatus.online ? 'online' : ''
  const bannedClass = isBanned ? 'yes' : ''
  const dropDownItems = [
    isBanned
      ? {
          icon: <UnblockIcon />,
          title: 'Unblock',
          onClick: () => {
            api.user.unblockUser({ id }).then(() => loadUsers())
          }
        }
      : {
          icon: <BlockIcon />,
          title: 'Block',
          onClick: () => {
            api.user.blockUser({ id }).then(() => loadUsers())
          }
        }
  ]

  const imageSrc = image
    ? `data:image/jpeg;base64, ${image}`
    : `${config.app.publicPath}/defaultImages/user-profile.jpg`

  return (
    <tr className={`c-user-item ${className}`}>
      <td id="image">
        <ImgWrapper src={imageSrc} alt="user-img" />
      </td>
      <td id="id">{id}</td>
      <td id="email">{email}</td>
      <td id="login">{login}</td>
      <td id="birthday">{birthday}</td>
      <td id="activity-status" className={activityStatusClass}>
        {status}
      </td>
      <td id="banned" className={bannedClass}>
        {isBanned ? 'Yes' : '-'}
      </td>
      <td id="tools">
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
    image: PropTypes.string,
    birthday: PropTypes.string,
    activityStatus: PropTypes.string,
    isBanned: PropTypes.bool
  }),
  loadUsers: PropTypes.func
}

export default UserItem
