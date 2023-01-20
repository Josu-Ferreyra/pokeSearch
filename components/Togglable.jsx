import { useState } from 'react'
import styles from '../styles/Togglable.module.css'

export default function Togglable ({ children }) {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div>
      <div
        className={styles.toggleContent}
        data-active={isVisible}
      >
        {children}
      </div>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsVisible(!isVisible)}
        data-color={!isVisible}
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
