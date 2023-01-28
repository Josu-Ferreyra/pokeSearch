import { useState } from 'react'
import styles from '../../styles/pkmData/PkmImage.module.css'

/*
NO SE USÓ -> import Image from 'next/image'
Hubieron errores al hacerle fetch a las imagenes y no supe como arreglarlo, es por
eso que opté por utilizar el tag <picture> pero en cuanto averigue como arreglar el
bug del componente Image de Next lo usaré.
*/

export default function PkmImage ({ sprites, pokemonName }) {
  const [shiny, setShiny] = useState(true)

  return (
    <div>
      <div className={styles.imageContainer}>
        {
            shiny
              ? (
                <picture>
                  <source srcSet={sprites.other.home.front_default} type='image/png' />
                  <source srcSet={sprites.other['official-artwork'].front_default} type='image/png' />
                  <source srcSet={sprites.other.dream_world.front_default} type='image/png' />
                  <source srcSet={sprites.front_default} type='image/png' />
                  <img
                    width={320}
                    height={320}
                    src='/img/pkmImage-NotFound.png'
                    alt={`${pokemonName} artwork`}
                  />
                </picture>
                )
              : (
                <picture>
                  <source srcSet={sprites.other.home.front_shiny} type='image/png' />
                  <img
                    width={320}
                    height={320}
                    src={sprites.front_shiny}
                    alt={`${pokemonName} artwork`}
                  />
                </picture>
                )
          }
      </div>
      {
          sprites.other.home.front_shiny
            ? (
              <button
                className={styles.shinyBtn}
                onClick={() => setShiny(!shiny)}
              >
                {shiny ? 'Show Shiny' : 'Show Default'}
              </button>
              )
            : <></>
        }
    </div>
  )
}
