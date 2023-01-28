import Togglable from '../Togglable'
import styles from '../../styles/pkmData/Abilities.module.css'

export default function Abilities ({ pokemonAbilities }) {
  return (
    <div className='container'>
      <h3 className='title'>Abilities</h3>
      {pokemonAbilities.map(ability => (
        <div key={ability.name} className={styles.ability}>
          <h3>{ability.name}</h3>
          <Togglable>
            {ability.isHidden && <p className={styles.hiddenAbility}>HIDDEN</p>}
            <p className={styles.abilityEffect}>
              {ability.effect}
            </p>
          </Togglable>
        </div>
      ))}
    </div>
  )
}
