import Link from 'next/link'
import styles from '../styles/Header.module.css'

export function Header () {
  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.logo}>Pokesearch</h1>
      <nav className={styles.navbar}>
        <ul>
          <li><Link href='/'>Home</Link></li>
        </ul>
      </nav>
    </header>
  )
}
