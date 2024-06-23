import InfiniteScroll from 'react-infinite-scroll-component'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../../api/api'
import { useDebounce } from '../../../hooks/_exports'
import { chatMethod } from '../../../socket/hubHandlers'
import Loader1 from '../../common/Loader/Loader1/Loader1'
import MessageGroup from './MessageGroup/MessageGroup'
import groupMessages from './helpers/groupMessages'
import './MessageList.scss'

const defaultPageSize = 30

function MessageList({ className, chatId }) {
  const [messages, setMessages] = useState([])
  const [groupedMessages, setGroupedMessages] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')
  const [memberImages, setMemberImages] = useState([])
  const debouncedSearchMessage = useDebounce(searchMessage, 500)
  const skipRef = useRef(0)
  const pageNumberRef = useRef(0)
  const messageListRef = useRef()
  const chatHub = useSelector((state) => state.signalR.chatHubConnection)

  useEffect(() => {
    chatHub.on(chatMethod.sendMessageRes, (data) => {
      setMessages((messageList) => [data, ...messageList])

      const { channelId } = data

      skipRef.current += 1

      setTimeout(() => {
        messageListRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }, 100)

      chatHub.invoke(chatMethod.channel, { channelId })
    })

    return () => {
      chatHub.off(chatMethod.sendMessageRes)
    }
  }, [chatHub])

  useEffect(() => {
    messageListRef.current.scrollTo({
      top: 0
    })
  }, [chatId])

  useEffect(() => {
    api.channel.memberImages({ channelId: chatId }).then(({ data }) => {
      setMemberImages(data?.memberImages || [])
    })
  }, [chatId])

  const loadMessages = async ({ channelId, pageNumber, pageSize, skip, searchField }) => {
    try {
      setIsLoading(true)

      if (!channelId) {
        return
      }

      const { data, response } = await api.chat.messages({
        channelId,
        pageNumber,
        pageSize,
        skip,
        searchField
      })

      if (response?.data?.clientMessage) {
        throw new Error(response.data.clientMessage)
      }

      if (!data || response?.data?.errors) {
        throw new Error('Something went wrong')
      }

      if (pageNumber === 0) {
        setMessages(data.messages || [])
      } else {
        setMessages((prevMessages) => [...prevMessages, ...(data.messages || [])])
      }

      setHasMore(pageNumberRef.current < data.meta.pagesCount - 1)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshMessages = useCallback(
    (search) => {
      pageNumberRef.current = 0
      skipRef.current = 0

      loadMessages({
        channelId: chatId,
        pageNumber: pageNumberRef.current,
        pageSize: defaultPageSize,
        searchField: search,
        skip: skipRef.current
      })
    },
    [chatId]
  )

  const onChangeMessageSearchHandler = (event) => {
    setSearchMessage(event.target.value)
  }

  useEffect(() => {
    refreshMessages(debouncedSearchMessage)
  }, [debouncedSearchMessage, refreshMessages])

  const fetchMoreMessages = () => {
    if (!isLoading) {
      pageNumberRef.current += 1

      loadMessages({
        channelId: chatId,
        pageNumber: pageNumberRef.current,
        pageSize: defaultPageSize,
        searchField: debouncedSearchMessage,
        skip: skipRef.current
      })
    }
  }

  useEffect(() => {
    const groupedMessageList = groupMessages(messages, memberImages)
    setGroupedMessages(groupedMessageList)
  }, [messages, memberImages])

  return (
    <div className={`c-message-list ${className}`}>
      <div className="list" id="scrollableDiv" ref={messageListRef}>
        <InfiniteScroll
          className="infinity-scroll"
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          loader={<Loader1 className="loader" />}
          scrollableTarget="scrollableDiv"
          inverse
        >
          {groupedMessages.map((groupsInfo) => {
            const [groupDate, groups] = groupsInfo

            return (
              <div key={groupDate} className="group-date">
                {groups.map((group) => (
                  <MessageGroup key={group.id} group={group} />
                ))}

                <div className="messages-date-wrapper">
                  <div className="messages-date">{groupDate}</div>
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

MessageList.defaultProps = {
  className: '',
  chatId: null
}

MessageList.propTypes = {
  className: PropTypes.string,
  chatId: PropTypes.number
}

export default MessageList
