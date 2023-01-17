import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home () {
  const [search, setSearch] = useState('false')
  const [pokeName, setPokeName] = useState('')
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    fetch(`/api/pokeSearch?pokeName=${pokeName}`)
      .then(res => res.json())
      .then(({ hits }) => setSearchResults(hits))
  }, [pokeName])
  return (
    <main>
      <Head>
        <title>PokeSearch</title>
        <meta name='description' content='Pokemon App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>
          POKE<span>SEARCH</span>
        </h1>
        <div className={`${styles.searchContainer}`} data-active={search}>
          <div className={styles.searchBar}>
            <input className={styles.search} onChange={({ target }) => setPokeName(target.value)} />
            <Image
              className={styles.searchIcon}
              src='/img/pokeball.png'
              width='512'
              height='512'
              alt='Pokeball icon'
              onClick={() => setSearch(!search)}
              priority
            />
          </div>
          <ul className={styles.searchResults}>
            {
              searchResults.map(pkm => (
                <li
                  key={pkm.name}
                  className={styles.searchResult}
                >
                  <Link
                    href={`/pokemon/${pkm.name}`}
                    style={{ textDecoration: 'none', color: '#000', display: 'block' }}
                  >
                    {pkm.name}
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </main>
  )
}
