import Togglable from '../Togglable'
import styles from '../../styles/pkmData/Stats.module.css'

export default function Stats ({ stats }) {
  return (
    <div className='container'>
      <h3 className='title'>Base Stats</h3>
      <Togglable maxHeight='70vh'>
        {
            stats.map(({ base_stat: base, stat }) => (
              <div
                className={styles.stat}
                key={stat.name}
                style={
                  base < 50
                    ? { '--statColor': '#F55' }
                    : (
                        base < 100
                          ? { '--statColor': '#ffb300' }
                          : { '--statColor': '#4E4' }
                      )
                }
              >
                <p className={styles.statName}>{stat.name}</p>
                <p className={styles.statValue}>
                  {base}
                </p>
              </div>
            ))
          }
      </Togglable>
    </div>
  )
}
