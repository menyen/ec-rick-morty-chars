
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const fetchUrls = async (uri) => {
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
      setter(s => ({...s, [key]: ({...urlResult, url: value})}))
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
  const charactersUrl = state?.characters?.url && new URL(state?.characters?.url)
  const currentPage = charactersUrl?.searchParams?.has('page') ? charactersUrl.searchParams.get('page') : 1

  const goToPage = (url) => {
    fetchUrls(url).then(json => setState(s => ({...s, characters: ({...json, url})})))
  }

  const clickPrevPagination = () => {
    goToPage(state?.characters?.info?.prev)
  }
  const clickNextPagination = () => {
    goToPage(state?.characters?.info?.next)
  }

  const filterUrl = (key, value) => {
    const searchParams = new URLSearchParams(charactersUrl.searchParams);
    searchParams.set(key, value);
    goToPage(`${charactersUrl.origin + charactersUrl.pathname}?${searchParams.toString()}`)
  }

  let paginationItems = []
  
  for (let i = 1; i <= state?.characters?.info?.pages; i++) {
    paginationItems.push(
      <Pagination.Item 
        key={i} 
        active={i === Number(currentPage)} 
        onClick={() => goToPage(`${charactersUrl.origin + charactersUrl.pathname}?page=${i}`)}
      >
        {i}
      </Pagination.Item>
    ) 
  }

  useEffect(() => {
    fetchRickAndMortyAPI(setState)
  }, [])

  return (
    <>
      <ButtonGroup className="mb-4 mt-4">
        <DropdownButton 
          as={ButtonGroup} 
          title={
            charactersUrl?.searchParams?.has('gender')
            ? `Filter applied: ${charactersUrl.searchParams.get('gender')}`
            : 'Filter By Gender'
          } 
        >
          <Dropdown.Item onClick={()=> filterUrl('gender', 'male')}>Male</Dropdown.Item>
          <Dropdown.Item onClick={()=> filterUrl('gender', 'female')}>Female</Dropdown.Item>
          <Dropdown.Item onClick={()=> filterUrl('gender', 'genderless')}>Genderless</Dropdown.Item>
          <Dropdown.Item onClick={()=> filterUrl('gender', 'unknown')}>Unknown</Dropdown.Item>
        </DropdownButton>
        <DropdownButton 
          as={ButtonGroup} 
          title={
            charactersUrl?.searchParams?.has('status')
            ? `Filter applied: ${charactersUrl.searchParams.get('status')}`
            : 'Filter By Status'
          }
        >
          <Dropdown.Item onClick={()=> filterUrl('status', 'alive')}>Alive</Dropdown.Item>
          <Dropdown.Item onClick={()=> filterUrl('status', 'dead')}>Dead</Dropdown.Item>
          <Dropdown.Item onClick={()=> filterUrl('status', 'unknown')}>Unknown</Dropdown.Item>
        </DropdownButton>
      </ButtonGroup>
      <Row xs={2} md={5} className="g-4">
        {state?.characters?.results?.map(char => {
          return (
            <Col key={char.id}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={char.image} />
                <Card.Body>
                  <Card.Title>{char.name}</Card.Title>
                  <Card.Subtitle>{char.gender}</Card.Subtitle>
                  <Card.Text style={{color: STATUS_COLOR[char.status]}}>
                    {char.status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
      <Pagination className="mb-4 mt-4">
        <Pagination.Prev disabled={!state?.characters?.info?.prev} onClick={clickPrevPagination} />
        {paginationItems}
        <Pagination.Next disabled={!state?.characters?.info?.next} onClick={clickNextPagination} />
      </Pagination>
    </>
  )
}
