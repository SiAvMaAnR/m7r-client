import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/_exports'
import api from '../../../api/api'
import { page } from '../../../constants/system'
import { Brand, FormButton, Logo, NavLink, FormInput } from '../../../components/_exports'
import './Login.scss'

const defaultClientMessage = 'Enter your login details'

function Login() {
  const navigate = useNavigate()
  const { logIn } = useAuth()
  const [loginData, setLoginData] = useState({})
  const [message, setMessage] = useState(defaultClientMessage)
  const [isLoading, setIsLoading] = useState(false)
  const [isActiveBtn, setIsActiveBtn] = useState(false)

  const { email, password } = loginData

  useEffect(() => {
    const isActive = loginData.email && loginData.password

    setMessage(defaultClientMessage)
    setIsActiveBtn(!!isActive)
  }, [loginData])

  const loginHandler = async () => {
    try {
      setIsLoading(true)

      const { data, response } = await api.auth.login({ email, password })

      if (response?.data?.errors) {
        throw new Error('Validation error')
      }

      if (response?.data?.clientMessage) {
        throw new Error(response.data.clientMessage)
      }

      if (!data) {
        throw new Error('Something went wrong')
      }

      logIn(data)
      navigate(page.home)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const submitHandler = (event) => {
    event.preventDefault()
  }

  const submitKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      loginHandler()
    }
  }

  return (
    <div className="p-login">
      <div className="login-header">
        <div className="brand-wrapper">
          <Brand className="brand">M|7|R</Brand>
        </div>
        <div className="sign-up-wrapper">
          <NavLink className="sign-up" link={page.registration}>
            Sign Up
          </NavLink>
        </div>
      </div>

      <div className="login-content">
        <div className="login-panel" onKeyDown={submitKeyDownHandler} role="presentation">
          <div className="logo-wrapper">
            <Logo className="logo" />
          </div>

          <div className="title">Sign in</div>

          <div className="client-message">{message}</div>

          <form className="form" onSubmit={(e) => submitHandler(e)}>
            <div className="inputs-wrapper">
              <FormInput
                className="email-input"
                type="email"
                placeholder="Email"
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                value={email}
                pattern=".+@.+\..+"
                required
              />
              <FormInput
                className="password-input"
                type="password"
                placeholder="Password"
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                value={password}
                required
              />
            </div>

            <div className="reset-password">
              <Link to={page.initResetPassword} className="reset-password-link">
                Forgot password?
              </Link>
            </div>

            <div className="button-wrapper">
              <FormButton
                className="submit-button"
                isActive={isActiveBtn}
                isLoading={isLoading}
                onClick={loginHandler}
              >
                Sign In
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
