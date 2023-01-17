// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import algoliasearch from 'algoliasearch'
import { createInMemoryCache } from '@algolia/cache-in-memory'

// TODO: CREATE .env for API KEYS AND THIS STUFF
const client = algoliasearch('WUW2QV49VZ', '7c2ed154a4997694b8b16941d734de26', { responsesCache: createInMemoryCache() })
const index = client.initIndex('pokemon_names')

export default async function handler (req, res) {
  const pkm = req.query.pokeName
  const { hits } = await index.search(pkm, { hitsPerPage: 10 })
  res.status(200).json({ hits })
}
