import Head from 'next/head'
import Script from 'next/script'
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
        <meta lang='en' />
        <title>PokeSearch</title>
        <meta name='description' content='Pokemon App' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      </Head>

      {/* GOOGLE ANALYTICS */}
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-YD9941KNLV'
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-YD9941KNLV');
        `}

      </Script>

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
              searchResults.length === 0
                ? <li className={styles.searchResult}>Pokemon Not Found</li>
                : searchResults.map(pkm => (
                  <li
                    key={pkm.name}
                    className={styles.searchResult}
                  >
                    <Link
                      href={`/pokemon/${pkm.name}/${pkm.url.split('/')[6]}`}
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
