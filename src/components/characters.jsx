
import { useState, useEffect } from 'react'

const fetchUrls = (uri) => {
  return fetch(uri).then(response => response.json()).then(json => {
    console.log(json)
    return json
})
}

const fetchRickAndMortyAPI = async (setter) => {
  return fetch('https://rickandmortyapi.com/api')
  .then((response) => {
    return response.json()
  })
  .then(async json => {
    for (const [key, value] of Object.entries(json)) {
      const urlResult = await fetchUrls(value)
      setter(s => ({...s, [key]: urlResult}))
    }
  })
};

const STATUS_COLOR = {
  'Alive': 'green',
  'Dead': 'red',
  'unknown': 'gray',
}
export default function Characters(props) {
  const [ state, setState] = useState()
  useEffect(() => {
    fetchRickAndMortyAPI(setState)
  }, [])
  return <>
    {state?.characters?.results?.map(char => {
      return (
        <div key={char.id} style={{backgroundColor: STATUS_COLOR[char.status] }}>
          <img src={char.image} />
          <p>{char.name}</p>
          <p>{char.gender}</p>
          <p>{char.status}</p>
        </div>
      )
    })}
  </>
}
