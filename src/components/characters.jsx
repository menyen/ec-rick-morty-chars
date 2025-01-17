
import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { getRickAndMortyCharacters, getRickAndMortyCharactersFiltered } from '../utils/graphql'

const STATUS_COLOR = {
  'Alive': 'green',
  'Dead': 'red',
  'unknown': 'gray',
}

export default function Characters(props) {
  
  const [ state, setState] = useState()
  const [ filter, setFilter ] = useState({page:1 })

  const clickPrevPagination = () => {
    setFilter(s => ({...s, page: s.page-1}))
  }
  const clickNextPagination = () => {
    setFilter(s => ({...s, page: s.page+1}))
  }

  const onFilter = (key, value) => {
    setFilter(s => ({...s, [key]: value}))
    localStorage.setItem(key, value);
  }

  let paginationItems = []
  
  for (let i = 1; i <= state?.characters?.info?.pages; i++) {
    paginationItems.push(
      <Pagination.Item 
        key={i} 
        active={i === Number(filter.page)} 
        onClick={() => setFilter(s => ({...s, page: i}))}
      >
        {i}
      </Pagination.Item>
    ) 
  }

  useEffect(() => {
    const gender = localStorage.getItem("gender");
    const status = localStorage.getItem("status");
    setFilter(s => ({...s, gender, status}))
    getRickAndMortyCharacters().then(characters => setState({characters}))
    getRickAndMortyCharactersFiltered(filter.page, gender, status).then(characters => setState({characters}))
  }, [])

  useEffect(() => {
    getRickAndMortyCharactersFiltered(filter.page, filter.gender, filter.status).then(characters => setState({characters}))
  }, [filter])

  return (
    <>
      <ButtonGroup className="mb-4 mt-4">
        <DropdownButton 
          as={ButtonGroup} 
          title={
            filter.gender
            ? `Filter applied: ${filter.gender}`
            : 'Filter By Gender'
          } 
        >
          <Dropdown.Item onClick={()=> onFilter('gender', 'male')}>Male</Dropdown.Item>
          <Dropdown.Item onClick={()=> onFilter('gender', 'female')}>Female</Dropdown.Item>
          <Dropdown.Item onClick={()=> onFilter('gender', 'genderless')}>Genderless</Dropdown.Item>
          <Dropdown.Item onClick={()=> onFilter('gender', 'unknown')}>Unknown</Dropdown.Item>
        </DropdownButton>
        <DropdownButton 
          as={ButtonGroup} 
          title={
            filter.status
            ? `Filter applied: ${filter.status}`
            : 'Filter By Status'
          }
        >
          <Dropdown.Item onClick={()=> onFilter('status', 'alive')}>Alive</Dropdown.Item>
          <Dropdown.Item onClick={()=> onFilter('status', 'dead')}>Dead</Dropdown.Item>
          <Dropdown.Item onClick={()=> onFilter('status', 'unknown')}>Unknown</Dropdown.Item>
        </DropdownButton>
      </ButtonGroup>
      <Row xs={2} md={5} lg={10} className="">
        {state?.characters?.results?.map(char => {
          return (
            <Col key={char.id}>
              <Card style={{ width: '10rem' }}>
                <Card.Img variant="top" src={char.image} />
                <Card.Body>
                  {/* <Card.Title>{char.name}</Card.Title> */}
                  <Card.Subtitle>
                    {char.name}
                    <br />
                    {char.gender}
                  </Card.Subtitle>
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
