
export const fetchUrls = async (uri) => {
  return fetch(uri).then(response => response.json()).then(json => {
    console.log(json)
    return json
})
}

export const fetchRickAndMortyAPI = async (setter) => {
  return fetch('https://rickandmortyapi.com/api')
  .then((response) => {
    return response.json()
  })
  .then(async json => {
    for (const [key, value] of Object.entries(json)) {
      const urlResult = await fetchUrls(value)
      setter(s => ({...s, [key]: ({...urlResult, url: value})}))
    }
  })
};
