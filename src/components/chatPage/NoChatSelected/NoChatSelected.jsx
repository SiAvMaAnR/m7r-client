import PropTypes from 'prop-types'
import { Logo } from '../../_exports'
import './NoChatSelected.scss'

function NoChatSelected({ className = '' }) {
  return (
    <div className={`c-no-chat-selected ${className}`}>
      <div className="empty-logo">
        <Logo className="logo" />
      </div>
      <h3 className="empty-title">No chat selected</h3>
      <p className="empty-subtitle">
        Choose a conversation from the list or start a new one
      </p>
    </div>
  )
}

NoChatSelected.propTypes = {
  className: PropTypes.string
}

export default NoChatSelected
