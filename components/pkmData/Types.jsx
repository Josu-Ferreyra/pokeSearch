import { pokemonTypes } from '../../utils/pokemonTypes'
import styles from '../../styles/pkmData/Types.module.css'

export default function Types ({ types }) {
  return (
    <div className={styles.typesContainer}>
      {
          types.map(({ type }) => (
            <div
              key={type.name}
              className={styles.type}
              style={{ '--clr': pokemonTypes[type.name] }}
            >
              {type.name}
            </div>
          ))
        }
    </div>
  )
}
