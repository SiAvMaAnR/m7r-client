import PropTypes from 'prop-types'
import { Logo } from '../../../_exports'
import './MessageListEmpty.scss'

function MessageListEmpty({ className = '', searchQuery = '' }) {
  return (
    <div className={`c-message-list-empty ${className}`}>
      <Logo className="logo" />
      <p>{searchQuery ? `No messages found for «${searchQuery}»` : 'No messages yet'}</p>
      {!searchQuery && <span>Send the first message to start the conversation</span>}
    </div>
  )
}

MessageListEmpty.propTypes = {
  className: PropTypes.string,
  searchQuery: PropTypes.string
}

export default MessageListEmpty
