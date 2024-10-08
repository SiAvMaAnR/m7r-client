import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { page } from '../constants/system'
import useAuth from './useAuth'
import api from '../api/api'
import { getAuthTokens } from '../utils/helpers/tokenHelper'

const reserveTime = 1000

const useRefreshToken = () => {
  const { updateAccessToken, logOut } = useAuth()
  const { accessTokenExp, refreshTokenExp, isLogged } = useSelector((state) => state.auth.info)
  const { accessToken, refreshToken } = getAuthTokens()
  const navigate = useNavigate()

  useEffect(() => {
    const leftTime = accessTokenExp - Date.now() - reserveTime

    const verifyTokenTimeout = setTimeout(() => {
      if (!isLogged) {
        return
      }

      if (refreshTokenExp > Date.now()) {
        api.auth.refreshToken({ refreshToken }).then((result) => {
          const newAccessToken = result?.data?.accessToken
          updateAccessToken({
            accessToken: newAccessToken
          })
        })
      } else {
        api.auth.revokeToken({ refreshToken }).finally(() => {
          logOut()
          navigate(page.login)
        })
      }
    }, leftTime)

    return () => clearTimeout(verifyTokenTimeout)
  }, [accessTokenExp, refreshToken, refreshTokenExp, isLogged, updateAccessToken, logOut, navigate])

  useEffect(() => {
    if (isLogged && !accessToken) {
      logOut()
      navigate(page.login)
    }
  }, [accessToken, logOut, navigate, isLogged])
}

export default useRefreshToken
