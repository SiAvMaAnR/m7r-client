import PropTypes from 'prop-types'
import './ImgIcon.scss'

function ImgIcon({ className = '', onClick = () => {} }) {
  return (
    <div onClick={onClick} className={`c-img-icon ${className}`} role="presentation">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
      >
        <path d="M7,10A4,4,0,1,0,3,6,4,4,0,0,0,7,10ZM7,4A2,2,0,1,1,5,6,2,2,0,0,1,7,4ZM2,22H22a1,1,0,0,0,.949-1.316l-4-12a1,1,0,0,0-1.708-.335l-5.39,6.289L8.6,12.2a1,1,0,0,0-1.4.2l-6,8A1,1,0,0,0,2,22Zm6.2-7.6,3.2,2.4a1,1,0,0,0,1.359-.149l4.851-5.659,3,9.008H4Z" />
      </svg>
    </div>
  )
}

ImgIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
}

export default ImgIcon
