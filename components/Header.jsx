import Link from 'next/link'
import styles from '../styles/Header.module.css'

export function Header () {
  return (
    <header className={styles.headerContainer}>
      <Link href='/' className={styles.logo}>Pokesearch</Link>
      {/* <nav className={styles.navbar}>
        <ul>
          <li><Link href='/'>Home</Link></li>
        </ul>
      </nav> */}
    </header>
  )
}
