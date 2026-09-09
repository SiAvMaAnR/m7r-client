import PropTypes from 'prop-types'
import { EmptyChatsIcon } from '../../../common/Icon/_exports'
import './ChannelListEmpty.scss'

function ChannelListEmpty({ className = '', isSearching = false }) {
  return (
    <div className={`c-channel-list-empty ${className}`}>
      <div className="empty-illustration">
        <EmptyChatsIcon className="empty-icon" />
      </div>
      <p className="empty-title">{isSearching ? 'Nothing found' : 'No chats yet'}</p>
      <span className="empty-hint">
        {isSearching
          ? 'Try a different search query'
          : 'Create a chat using the + button above'}
      </span>
    </div>
  )
}

ChannelListEmpty.propTypes = {
  className: PropTypes.string,
  isSearching: PropTypes.bool
}

export default ChannelListEmpty
