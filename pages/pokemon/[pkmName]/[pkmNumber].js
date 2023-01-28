/* Import Page Modules */
import Head from 'next/head'
import { Layout } from '../../../components/Layout'

/* Import Function Modules */
import PkmImage from '../../../components/pkmData/PkmImage'
import Types from '../../../components/pkmData/Types'
import Abilities from '../../../components/pkmData/Abilities'
import Varieties from '../../../components/pkmData/Varieties'
import Stats from '../../../components/pkmData/Stats'

/* Import Styles */
import styles from '../../../styles/Pokemon.module.css'

export default function Pokemon ({ pokemonName, sprites, description, types, pokemonAbilities, varieties, stats }) {
  return (
    <Layout>
      <Head>
        <title>{`${pokemonName.toUpperCase()} - PokeSearch`}</title>
        <meta name='description' content={`Pokemon ${pokemonName}: sprites, types, evolve chain, moves, and more`} />
      </Head>

      <div className={styles.pkmContainer}>
        <PkmImage sprites={sprites} pokemonName={pokemonName} />
        <h2 className={styles.pkmName}>{pokemonName}</h2>
        <p className={styles.description}>{description}</p>
        <Types types={types} />
        <Abilities pokemonAbilities={pokemonAbilities} />
        <Varieties varieties={varieties} />
        <Stats stats={stats} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps (context) {
  const { pkmNumber } = context.params // { pkmName: 'bulbasaur', pkmNumber: '1'}

  // API CALL -> End Point: "Pokemon"
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmNumber}/`)
  const pokemonData = await res.json()

  // Receive the response and destructuring it into variables
  const {
    species: { name: pokemonName },
    // Changed "name" into "pokemonName" for better understanding in the code
    sprites,
    types,
    species,
    abilities,
    stats
  } = pokemonData

  // API CALL -> End Point: "Species"
  const response = await fetch(species.url)
  const speciesData = await response.json()

  // Recieve the response and destructuring it into variables
  const {
    color: { name: pkmColor },
    // Changed "name" into "pkmColor" for better understanding in the code
    flavor_text_entries: pokedexEntries,
    // Changed "flavor_text_entries" into "pokedexEntries" for better understanding in the code
    varieties
  } = speciesData

  // Now we fetch each ability url and format it's response
  // Start an empty array to store the formated abilities
  const pokemonAbilities = []

  // Waits to settled all promises
  await Promise.allSettled(
    // Creates a Promises Array with map
    abilities.map(async ({ ability, is_hidden: isHidden }) => {
      // Create the formatedAbility object with the known values
      const formatedAbility = { name: ability.name, isHidden }

      // Fetch the ability to get it's effect
      const res = await fetch(ability.url)
      // Destructuring the response and change the variables names to better understanding
      const { effect_entries: effects, flavor_text_entries: entries } = await res.json()
      /*
        Assings the effect field with the effect of the ability, and if it doesn't have one
        we replace it with the entry
      */
      formatedAbility.effect = (
        (
          effects.find(effect => effect.language.name === 'en')?.effect
        ) ||
        (
          entries.find(entry => entry.language.name === 'en').flavor_text
        ))

      // After all we push the formatedAbility to the pokemonAbilities array
      pokemonAbilities.push(formatedAbility)
    })
  )

  // Finds the English description and removes a special character \f from the description given
  const description = pokedexEntries
    .find(entry => entry.language.name === 'en')
    .flavor_text.split()[0]
    .replace('\f', ' ')

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
