import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient('https://rickandmortyapi.com/graphql')

export async function getRickAndMortyCharacters() {
  const query = gql`
    query{
      characters {
        info {
          next
          pages
          prev
        }
        results {
          id
          name
          gender
          status
          image
        }
      }
    }
  `

  const { characters } = await client.request(query)
  return characters
}

export async function getRickAndMortyCharactersFiltered(page, gender, status) {
  const query = gql`
    query ($page: Int, $gender: String, $status: String){
      characters( page: $page, filter: { gender: $gender, status: $status }  ) {
        info {
          next
          pages
          prev
        }
        results {
          id
          name
          gender
          status
          image
        }
      }
    }
  `

  const { characters } = await client.request(query, {page, gender, status})
  return characters
}