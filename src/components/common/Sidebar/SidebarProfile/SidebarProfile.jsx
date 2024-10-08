import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import api from '../../../../api/api'
import { page } from '../../../../constants/system'
import { useRole, useAuth } from '../../../../hooks/_exports'
import MenuIcon from '../../Icon/MenuIcon/MenuIcon'
import DropDown from '../../DropDown/DropDown'
import LogoutIcon from './MenuIcons/LogoutIcon/LogoutIcon'
import SettingsIcon from './MenuIcons/SettingsIcon/SettingsIcon'
import config from '../../../../config/configuration'
import './SidebarProfile.scss'

function SidebarProfile({ className = '', isExpand = false }) {
  const [image, setImage] = useState(null)
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const expandClass = isExpand ? 'expand' : ''
  const userRole = useRole()
  const { logOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.account.image().then((result) => {
      setImage(result?.data?.image)
    })
  }, [])

  useEffect(() => {
    api.account.profile().then((result) => {
      setEmail(result?.data?.email ?? 'none')
      setLogin(result?.data?.login ?? 'none')
    })
  }, [userRole])

  const menuItems = [
    {
      icon: <SettingsIcon />,
      title: 'Settings',
      onClick: () => {}
    },
    {
      icon: <LogoutIcon />,
      title: 'LogOut',
      onClick: () => {
        logOut()
        navigate(page.login)
      }
    }
  ]

  const imageSrc = image
    ? `data:image/jpeg;base64, ${image}`
    : `${config.app.publicPath}/defaultImages/user-profile.jpg`

  return (
    <div className={`c-sidebar-profile ${className} ${expandClass}`}>
      <div className="sidebar-profile-image">
        <img
          src={imageSrc}
          alt="profile-img"
          onClick={() => navigate(page.profile)}
          role="presentation"
        />
      </div>

      <div className="sidebar-profile-info">
        <div className="sidebar-profile-login">{login}</div>
        <div className="sidebar-profile-email">{email}</div>
      </div>

      <div className="sidebar-profile-menu">
        <DropDown items={menuItems} className="right">
          <MenuIcon className="menu-icon" />
        </DropDown>
      </div>
    </div>
  )
}

SidebarProfile.propTypes = {
  className: PropTypes.string,
  isExpand: PropTypes.bool
}

export default SidebarProfile
