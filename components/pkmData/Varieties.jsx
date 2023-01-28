import Link from 'next/link'
import Togglable from '../Togglable'
import styles from '../../styles/pkmData/Varieties.module.css'

export default function Varieties ({ varieties }) {
  return (
    varieties.length > 1
      ? (
        <div className='container'>
          <h3 className='title'>Varieties</h3>
          <Togglable>
            {
              varieties
                .filter(variety => !variety.is_default)
                .map(variety => (
                  <Link
                    className={styles.varietyLink}
                    href={`/pokemon/${variety.pokemon.name}/${variety.pokemon.url.split('/')[6]}`}
                    key={variety.pokemon.name}
                  >
                    <button
                      className={styles.varietyBtn}
                    >
                      {variety.pokemon.name}
                    </button>
                  </Link>
                ))
            }
          </Togglable>
        </div>
        )
      : <></>
  )
}
