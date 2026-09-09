import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import api from '../../../api/api'
import ChatHeader from '../../../components/chatPage/ChatHeader/ChatHeader'
import ChannelList from '../../../components/chatPage/ChannelList/ChannelList'
import MessageList from '../../../components/chatPage/MessageList/MessageList'
import NewMessage from '../../../components/chatPage/NewMessage/NewMessage'
import NoChatSelected from '../../../components/chatPage/NoChatSelected/NoChatSelected'
import useMessagesReceiverForCounter from '../../../components/chatPage/MessageList/hooks/useMessagesReceiverForCounter'
import './Chat.scss'

function Chat() {
  const { id } = useParams()
  const [selectedChannelId, setSelectedChannelId] = useState(id)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [isLoadingChatHeader, setIsLoadingChatHeader] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')
  const chatHub = useSelector((state) => state.signalR.chatHub)

  const loadChannel = async (channelId) => {
    try {
      setIsLoadingChatHeader(true)

      const result = await api.channel.accountChannel({ id: channelId })

      setSelectedChannel(result.data)
    } finally {
      setIsLoadingChatHeader(false)
    }
  }

  useEffect(() => {
    if (selectedChannelId) {
      loadChannel(selectedChannelId)
    } else {
      setSelectedChannel(null)
    }
  }, [selectedChannelId])

  useEffect(() => {
    setSelectedChannelId(id)
  }, [id])

  useMessagesReceiverForCounter({ chatId: +selectedChannelId, chatHub })

  return (
    <div className="p-chat">
      <ChannelList
        className="channels"
        selectedChannelId={+selectedChannelId}
        setSelectedChannelId={setSelectedChannelId}
      />

      <div className="chat-wrapper">
        {selectedChannelId ? (
          <div className="chat">
            <div className="chat-header-container">
              <ChatHeader
                className="chat-header"
                channel={selectedChannel}
                isLoading={isLoadingChatHeader}
                setSearchMessage={setSearchMessage}
                searchMessage={searchMessage}
              />
            </div>
            <div className="chat-content">
              <div className="chat-messages">
                <MessageList chatId={+selectedChannelId} searchMessage={searchMessage} />
              </div>
              <div className="chat-input">
                <NewMessage channelId={+selectedChannelId} />
              </div>
            </div>
          </div>
        ) : (
          <div className="chat not-selected">
            <NoChatSelected />
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
