import PropTypes from 'prop-types'
import './UsersIcon.scss'

function UsersIcon({ className }) {
  return (
    <div className={`c-users-icon ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        fill="none"
      >
        <g clipPath="url(#clip0_1251_98416)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z"
            fill="#000000"
          />
          <path
            d="M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z"
            fill="#000000"
          />
          <path
            d="M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z"
            fill="#000000"
          />
          <path
            d="M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z"
            fill="#000000"
          />
        </g>
        <defs>
          <clipPath id="clip0_1251_98416">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

UsersIcon.defaultProps = {
  className: ''
}

UsersIcon.propTypes = {
  className: PropTypes.string
}

export default UsersIcon
