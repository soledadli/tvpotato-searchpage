import React from 'react'
import styled from 'styled-components'

const TvShowContainer = styled.div`
    width: auto;
    max-height: 150px;
    display: flex;
    border-bottom: 2px solid #d8d8d852; 
    align-items: center;
`

const Thumbnail = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    flex: 0.3;
    img {
        width: 90px;
        height: 120px;
        padding: 1%;
    } 
`

const Name = styled.a`
    font-size: 22px;
    margin-left: 10px;
    flex: 1;
    display: flex;
    color: blue;
    text-decoration:none;
    font-weight: 500;
`
const Genre = styled.span`
    font-size = 18px;
    margin-left: 10px;
    flex: 0.5;
    color: #a1a1a1;
`

const Rating = styled.span`
    color: #a1a1a1;
    font-size: 16px;
    flex: 0.2;
    display: flex;
`

const Tvshows = (props) => {
  const {thumbnailSrc, name, rating, link, genre} = props

  return (
      <TvShowContainer>
          <Thumbnail>
              <img src= {thumbnailSrc || 'No Image Available'} />
          </Thumbnail>
          <Name href={link} target='_blank' rel="noopener">{name}</Name>
          <Genre>{genre || 'N/A'}</Genre>
          <Rating>{rating || 'N/A'}</Rating>
      </TvShowContainer>
  )
}

export default Tvshows
 