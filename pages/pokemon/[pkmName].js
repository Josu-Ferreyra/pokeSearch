import Head from 'next/head'
import Togglable from '../../components/Togglable'
import { pokemonTypes } from '../../utils/pokemonTypes'
import styles from '../../styles/Pokemon.module.css'
import { Layout } from '../../components/Layout'
import { useState } from 'react'
/*
NO SE USÓ -> import Image from 'next/image'
Hubieron errores al hacerle fetch a las imagenes y no supe como arreglarlo, es por
eso que opté por utilizar el tag <picture> pero en cuanto averigue como arreglar el
bug del componente Image de Next lo usaré.
*/

export default function Pokemon ({ pokemonName, sprites, description, types, pokemonAbilities, pkmColor }) {
  const [shiny, setShiny] = useState(true)
  return (
    <Layout>
      <Head>
        <title>{`${pokemonName.toUpperCase()} - PokeSearch`}</title>
        <meta name='description' content={`Pokemon ${pokemonName}: sprites, types, evolve chain, moves, and more`} />
      </Head>

      <div className={styles.pkmContainer}>
        <div className={styles.imageContainer}>
          {
            shiny
              ? (
                <picture>
                  <source srcSet={sprites.other.home.front_default} type='image/png' />
                  <img
                    width={320}
                    height={320}
                    src={sprites.front_default}
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
        <button
          className={styles.shinyBtn}
          onClick={() => setShiny(!shiny)}
        >
          {
            shiny ? 'Show Shiny' : 'Show Default'
          }
        </button>
        <h2 className={styles.pkmName}>{pokemonName}</h2>
        <p className={styles.description}>{description}</p>
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
        <div className={styles.abilitiesContainer}>
          <h3 className={styles.abilitiesTitle}>Abilities</h3>
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
      </div>
    </Layout>
  )
}

export async function getServerSideProps (context) {
  const { pkmName } = context.params

  // API CALL -> End Point: "Pokemon"
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmName}/`)
  const pokemonData = await res.json()
  const { species: { name: pokemonName }, sprites, types, species, abilities } = pokemonData

  // API CALL -> End Point: "Species"
  const response = await fetch(species.url)
  const speciesData = await response.json()
  const { color: { name: pkmColor }, flavor_text_entries: pokedexEntries } = speciesData

  const pokemonAbilities = []
  await Promise.allSettled(
    abilities.map(async ({ ability, is_hidden: isHidden }) => {
      const formatedAbility = { name: ability.name, isHidden }
      await fetch(ability.url)
        .then(res => res.json())
        .then(({ effect_entries: effects }) => {
          formatedAbility.effect = effects[1].effect
          pokemonAbilities.push(formatedAbility)
        })
    })
  )

  // Finds the English description and removes a special character \f from the description given
  const description = pokedexEntries.find(entry => entry.language.name === 'en').flavor_text.split()[0].replace('\f', ' ')

  return {
    props: { pokemonName, sprites, types, description, pkmColor, pokemonAbilities, speciesData, pokemonData }
  }
}
