import PropTypes from 'prop-types'
import './StatusBadge.scss'

function StatusBadge({ className = '', status = '', isOnline = false }) {
  return (
    <span className={`c-status-badge ${isOnline ? 'online' : ''} ${className}`}>
      <span className="status-dot" />
      {status}
    </span>
  )
}

StatusBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
  isOnline: PropTypes.bool
}

export default StatusBadge
