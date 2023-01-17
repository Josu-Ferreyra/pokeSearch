import Head from 'next/head'
import Image from 'next/image'
import { pokemonTypes } from '../../utils/pokemonTypes'
import styles from '../../styles/Pokemon.module.css'
import { Layout } from '../../components/Layout'

export default function Pokemon ({ pokemonName, sprites, description, types, pokemonAbilities }) {
  return (
    <Layout>
      <Head>
        <title>{`${pokemonName.toUpperCase()} - PokeSearch`}</title>
        <meta name='description' content={`Pokemon ${pokemonName}: sprites, types, evolve chain, moves, and more`} />
      </Head>
      <div className={styles.pkmContainer}>
        <div className={styles.imageContainer}>
          <Image
            width={200}
            height={200}
            src={sprites.other['official-artwork'].front_default}
            alt={`${pokemonName} artwork`}
            priority
          />
        </div>
        <h2 className={styles.pkmName}>{pokemonName}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.typesContainer}>
          {
          types.map(({ type }) => (
            <li
              key={type.name}
              className={styles.type}
              style={{ '--clr': pokemonTypes[type.name] }}
            >
              {type.name}
            </li>
          ))
        }
        </div>
        <div className={styles.abilitiesContainer}>
          {pokemonAbilities.map(ability => (
            <div key={ability.name} className={styles.ability}>
              <h3>{ability.name}</h3>
              <p>{ability.effect}</p>
              {ability.isHidden ? <p>IS HIDDEN</p> : <p>IS NOT HIDDEN</p>}
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
  const { name: pokemonName, sprites, types, species, abilities } = pokemonData

  // API CALL -> End Point: "Species"
  const response = await fetch(species.url)
  const speciesData = await response.json()
  const { color: { name: pkmColor }, flavor_text_entries } = speciesData

  const pokemonAbilities = []
  await Promise.allSettled(
    abilities.map(async ({ ability, is_hidden }) => {
      const formatedAbility = { name: ability.name, isHidden: is_hidden }
      await fetch(ability.url)
        .then(res => res.json())
        .then(({ effect_entries }) => {
          formatedAbility.effect = effect_entries[1].effect
          pokemonAbilities.push(formatedAbility)
        })
    })
  )

  // Finds the English description and removes a special character \f from the description given
  const description = flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text.split()[0].replace('\f', ' ')

  return {
    props: { pokemonName, sprites, types, description, pkmColor, pokemonAbilities, speciesData, pokemonData }
  }
}
