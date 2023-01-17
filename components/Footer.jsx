import styles from '../styles/Footer.module.css'

export function Footer () {
  return (
    <footer className={styles.footerContainer}>
      <p>
        PokeSearch by <a href='https://www.linkedin.com/in/josue-ferreyra' target='_blank' rel='noreferrer'>Josué Ferreyra</a>
      </p>
    </footer>
  )
}
