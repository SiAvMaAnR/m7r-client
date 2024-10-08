import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import TokenHelper from '../utils/helpers/tokenHelper'
import { setInfo, clearInfo, updateInfo } from '../redux/slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()

  const updateAccessToken = useCallback(
    ({ accessToken }) => {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)

        const tokenHelper = new TokenHelper(accessToken)
        const tokenPayload = tokenHelper.getPayload()

        const { id, role, exp: accessTokenExp } = tokenPayload || {}
        const isLogged = true

        dispatch(
          updateInfo({
            id,
            role,
            isLogged,
            accessTokenExp: (accessTokenExp || 0) * 1000
          })
        )
      }
    },
    [dispatch]
  )

  const logIn = useCallback(
    ({ accessToken, refreshToken, refreshTokenExp }) => {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        const tokenHelper = new TokenHelper(accessToken)
        const tokenPayload = tokenHelper.getPayload()

        const { id, role, exp: accessTokenExp } = tokenPayload || {}
        const isLogged = true

        dispatch(
          setInfo({
            id,
            role,
            isLogged,
            accessTokenExp: (accessTokenExp || 0) * 1000,
            refreshTokenExp: new Date(refreshTokenExp).getTime()
          })
        )
      }
    },
    [dispatch]
  )

  const logOut = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch(clearInfo())
  }, [dispatch])

  return { logIn, logOut, updateAccessToken }
}

export default useAuth
