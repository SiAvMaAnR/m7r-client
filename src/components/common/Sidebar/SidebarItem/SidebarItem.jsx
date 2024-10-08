import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './SidebarItem.scss'

function SidebarItem({
  isExpand = false,
  className = '',
  title = '',
  children = null,
  link = '',
  noticeCounter = 0
}) {
  const expandClass = isExpand ? 'expand' : ''
  const counter = noticeCounter > 99 ? '99+' : noticeCounter

  return (
    <Link className={`c-sidebar-item ${className} ${expandClass}`} to={link}>
      <div className="sidebar-item-icon">{children}</div>
      <div className="sidebar-item-title">{title}</div>
      <div className="sidebar-item-notice-counter">
        <div className="notice-counter-wrapper">{counter}</div>
      </div>
    </Link>
  )
}

SidebarItem.propTypes = {
  className: PropTypes.string,
  isExpand: PropTypes.bool,
  title: PropTypes.string,
  link: PropTypes.string,
  noticeCounter: PropTypes.number,
  children: PropTypes.element
}

export default SidebarItem
