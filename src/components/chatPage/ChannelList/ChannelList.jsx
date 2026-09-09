import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Channel from './Channel/Channel'
import ChannelFilter from './ChannelFilter/ChannelFilter'
import { ToolTip1 } from '../../_exports'
import ChannelSearch from './ChannelSearch/ChannelSearch'
import ChannelListEmpty from './ChannelListEmpty/ChannelListEmpty'
import api from '../../../api/api'
import { useDebounce } from '../../../hooks/_exports'
import { page } from '../../../constants/system'
import { chatMethod } from '../../../socket/hubHandlers'
import DropDown from '../../common/DropDown/DropDown'
import { AIIcon, CreateIcon, CreateIcon1 } from '../../common/Icon/_exports'
import Loader1 from '../../common/Loader/Loader1/Loader1'
import CreateAIChannelModal from '../Modals/CreateAIChannelModal/CreateAIChannelModal'
import CreateChannelModal from '../Modals/CreateChannelModal/CreateChannelModal'
import './ChannelList.scss'

const defaultPageSize = 15

function ChannelList({ className = '', selectedChannelId = null }) {
  const navigate = useNavigate()
  const [isListLoading, setIsListLoading] = useState(false)
  const [isScrollLoading, setIsScrollLoading] = useState(false)
  const [channels, setChannels] = useState([])
  const [pagesCount, setPagesCount] = useState(0)
  const [searchChannel, setSearchChannel] = useState('')
  const debouncedSearchChannel = useDebounce(searchChannel, 500)
  const [isActiveCreateChannelModal, setIsActiveCreateChannelModal] = useState(false)
  const [isActiveCreateAIChannelModal, setIsActiveCreateAIChannelModal] = useState(false)
  const [activeChannelType, setActiveChannelCount] = useState(null)
  const pageNumberRef = useRef(0)
  const channelListRef = useRef()
  const chatHub = useSelector((state) => state.signalR.chatHub)

  useEffect(() => {
    if (chatHub && chatHub.isConnected) {
      const updateChannelsHandler = (curChannels, updatedChannel) => {
        const prevChannels = curChannels.filter((channel) => channel.id !== updatedChannel.id)
        return [updatedChannel, ...prevChannels]
      }

      chatHub.connection.on(chatMethod.channelRes, (updatedChannel) => {
        if (activeChannelType === null || activeChannelType === updatedChannel.type) {
          setChannels((curChannels) => updateChannelsHandler(curChannels, updatedChannel))
        }
      })

      chatHub.connection.on(chatMethod.readChannelRes, ({ channelId, unreadMessagesCount }) => {
        setChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channelId === channel.id ? { ...channel, unreadMessagesCount } : channel
          )
        )
      })
    }

    return () => {
      if (chatHub) {
        chatHub.connection.off(chatMethod.channelRes)
        chatHub.connection.off(chatMethod.readChannelRes)
      }
    }
  }, [chatHub, activeChannelType])

  const loadChannels = async ({ searchField, pageNumber, pageSize, type, signal }) => {
    const { data, response } = await api.channel.accountChannels({
      searchField,
      pageNumber,
      pageSize,
      channelType: type
    })

    if (signal?.aborted) return

    if (response?.data?.clientMessage) {
      throw new Error(response.data.clientMessage)
    }

    if (!data || response?.data?.errors) {
      throw new Error('Something went wrong')
    }

    if (pageNumber === 0) {
      setChannels(data.channels || [])
    } else {
      setChannels((prevChannels) => [...prevChannels, ...(data.channels || [])])
    }

    setPagesCount(data.meta.pagesCount)
  }

  const refreshChannels = useCallback(
    async (search, isSmoothScroll, signal) => {
      const scrollBehavior = isSmoothScroll ? 'smooth' : 'auto'

      pageNumberRef.current = 0

      channelListRef.current.scrollTo({
        top: 0,
        behavior: scrollBehavior
      })
      try {
        setIsListLoading(true)

        await loadChannels({
          pageNumber: pageNumberRef.current,
          pageSize: defaultPageSize,
          searchField: search,
          type: activeChannelType,
          signal
        })
      } catch (err) {
        // temp
      } finally {
        if (!signal?.aborted) {
          setIsListLoading(false)
        }
      }
    },
    [activeChannelType]
  )

  const onChangeChannelSearchHandler = (event) => {
    setSearchChannel(event.target.value)
  }

  useEffect(() => {
    const abortController = new AbortController()
    refreshChannels(debouncedSearchChannel, false, abortController.signal)
    return () => abortController.abort()
  }, [debouncedSearchChannel, refreshChannels])

  const scrollHandler = async (event) => {
    if (!isScrollLoading && pageNumberRef.current < pagesCount - 1) {
      const { scrollHeight, scrollTop } = event.target
      const targetHeight = event.target.getBoundingClientRect().height

      const isNeedUpdate = scrollHeight - (scrollTop + targetHeight) < 300

      if (isNeedUpdate) {
        pageNumberRef.current += 1

        try {
          setIsScrollLoading(true)

          await loadChannels({
            pageNumber: pageNumberRef.current,
            pageSize: defaultPageSize,
            searchField: debouncedSearchChannel,
            type: activeChannelType
          })
        } catch (err) {
          // temp
        } finally {
          setIsScrollLoading(false)
        }
      }
    }
  }

  const onCreatedChannelHandler = () => {
    refreshChannels(debouncedSearchChannel, true)
  }

  const dropDownItems = [
    {
      icon: <CreateIcon />,
      title: 'Create chat',
      onClick: () => setIsActiveCreateChannelModal(true)
    },
    {
      icon: <AIIcon />,
      title: 'AI chat',
      onClick: () => setIsActiveCreateAIChannelModal(true)
    }
  ]

  const isEmpty = !isListLoading && channels.length === 0

  return (
    <>
      <CreateChannelModal
        setIsActive={setIsActiveCreateChannelModal}
        isActive={isActiveCreateChannelModal}
        onCreatedChannel={onCreatedChannelHandler}
      />
      <CreateAIChannelModal
        setIsActive={setIsActiveCreateAIChannelModal}
        isActive={isActiveCreateAIChannelModal}
        onCreatedChannel={onCreatedChannelHandler}
      />

      <div className={`c-channel-list ${className}`}>
        <div className="channels-header">
          <div className="header-search">
            <ChannelSearch className="channel-search" onChange={onChangeChannelSearchHandler} />
          </div>
          <div className="header-new-channel">
            <DropDown className="dropdown-wrapper" items={dropDownItems}>
              <ToolTip1 text="New channel">
                <CreateIcon1 className="new-channel-icon" />
              </ToolTip1>
            </DropDown>
          </div>
        </div>

        <div className="channels-filters">
          <ChannelFilter
            className="filter"
            setType={setActiveChannelCount}
            type={activeChannelType}
          />
        </div>

        <div className="list" onScroll={scrollHandler} ref={channelListRef}>
          {isListLoading && <Loader1 className="loader" />}

          {isEmpty && <ChannelListEmpty isSearching={!!debouncedSearchChannel} />}

          {!isListLoading &&
            channels.map((channel) => (
              <Channel
                key={channel.id}
                onClick={() => {
                  navigate(`${page.chat}/${channel.id}`)
                }}
                isActive={+selectedChannelId === channel.id}
                data={channel}
              />
            ))}
        </div>
      </div>
    </>
  )
}

ChannelList.propTypes = {
  className: PropTypes.string,
  selectedChannelId: PropTypes.number
}

export default ChannelList
