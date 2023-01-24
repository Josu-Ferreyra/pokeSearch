import Head from 'next/head'
import Togglable from '../../../components/Togglable'
import { pokemonTypes } from '../../../utils/pokemonTypes'
import styles from '../../../styles/Pokemon.module.css'
import { Layout } from '../../../components/Layout'
import { useState } from 'react'
import Link from 'next/link'
/*
NO SE USÓ -> import Image from 'next/image'
Hubieron errores al hacerle fetch a las imagenes y no supe como arreglarlo, es por
eso que opté por utilizar el tag <picture> pero en cuanto averigue como arreglar el
bug del componente Image de Next lo usaré.
*/

export default function Pokemon ({ pokemonName, sprites, description, types, pokemonAbilities, varieties, stats }) {
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
        {varieties.length > 1
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
          : <></>}
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

      </div>
    </Layout>
  )
}

export async function getServerSideProps (context) {
  const { pkmNumber } = context.params // { pkmName: 'bulbasaur', pkmNumber: '1'}

  // API CALL -> End Point: "Pokemon"
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmNumber}/`)
  const pokemonData = await res.json()
  const {
    species: { name: pokemonName },
    sprites,
    types,
    species,
    abilities,
    stats
  } = pokemonData

  // API CALL -> End Point: "Species"
  const response = await fetch(species.url)
  const speciesData = await response.json()
  const {
    color: { name: pkmColor },
    flavor_text_entries: pokedexEntries,
    varieties
  } = speciesData

  const pokemonAbilities = []
  await Promise.allSettled(
    abilities.map(async ({ ability, is_hidden: isHidden }) => {
      const formatedAbility = { name: ability.name, isHidden }
      await fetch(ability.url)
        .then(res => res.json())
        .then(({ effect_entries: effects, flavor_text_entries: entries }) => {
          formatedAbility.effect = (
            (
              effects.find(effect => effect.language.name === 'en')?.effect
            ) ||
            (
              entries.find(entry => entry.language.name === 'en').flavor_text
            ))
          pokemonAbilities.push(formatedAbility)
        })
    })
  )

  // Finds the English description and removes a special character \f from the description given
  const description = pokedexEntries.find(entry => entry.language.name === 'en').flavor_text.split()[0].replace('\f', ' ')

  return {
    props: {
      pokemonName,
      varieties,
      sprites,
      types,
      stats,
      description,
      pkmColor,
      pokemonAbilities,
      speciesData,
      pokemonData
    }
  }
}
