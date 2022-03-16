import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { IoSearch, IoClose } from 'react-icons/io5'
import { AnimatePresence, motion } from "framer-motion"
import { useClickOutside } from "react-click-outside-hook";
import { PacmanLoader } from 'react-spinners';
import { useDebounce } from '../Hooks/debounceHook';
import axios from 'axios';
import Tvshows from './Tvshows';

const SearchbarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 50em;
  height: 5em;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 12px 3px rgba(0,0,0,0.2);
  padding: 0 0 1% 0;
`

const SearchInputContainer = styled.div`
    width: 100%;
    min-height: 4em;
    display: flex;
    align-items: center;
    position: relative;
`

const SearchInput = styled.input`
  width: 85%;
  outline: none;
  border: none;
  vertical-align: middle;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  border-radius: 10px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: gray;
    transition: all 250ms ease-in-out;
  }
`
const SearchIcon = styled.span` 
  color: grey;
  font-size: 2em;
  vertical-align: middle;
  padding: 1% 2% 0 2%;
  vertical-align: middle;
`

const CloseIcon = styled(motion.span)` 
  color: #bebebe;
  font-size: 2em;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`

const LineSeperator = styled.span` 
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em 0 1em 0;
  overflow-y: auto;
`
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const containerVariants = {
  expanded: {
    height: "35em",

  },

  collapsed: {
    height: "3em",

  }
}

const WarningMessage = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  display: flex;
  align-self: center;
  justify-self: center;
`

const containerTransition = { type: 'spring', damping: 22, stiffness: 150 }

const Searchbar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [parentRef, isClickedOutside] = useClickOutside()
  const inputRef = useRef()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tvShows, setTvShows] = useState([])
  const [noFindings, setNoFindings] = useState(false)

  const isEmpty = !tvShows || tvShows.length === 0

  const handleChange = (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
    if(e.target.value.trim() === '') {setNoFindings(false)}
  }

  const expandContainer = () => {
    setIsExpanded(true)
  }

  const collapseContainer = () => {
    setIsExpanded(false)
    setSearchQuery('')
    setIsLoading(false)
    setTvShows([])
    setNoFindings(false)
    if (inputRef.current)
      inputRef.current.value = ''
  }

  useEffect(() => {
    if (isClickedOutside) collapseContainer();
  }, [isClickedOutside])

  const prepareSearchQuery = (query) => {
    const url = `https://cors-everywhere.herokuapp.com/http://api.tvmaze.com/search/shows?q=${query}`;
    return encodeURI(url);
  };

  const searchTvShow = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;

    setIsLoading(true);
    setNoFindings(false)

    const URL = prepareSearchQuery(searchQuery);

    const response = await axios.get(URL).catch((err) => {
      console.log("Error: ", err);
    });

    if (response) {
      console.log("Response: ", response.data);
      if (response.data && response.data.length === 0) 
        {setNoFindings(true)}
      setTvShows(response.data)

    }
    setIsLoading(false);
  };

  useDebounce(searchQuery, 500, searchTvShow)
  return (
    <SearchbarContainer animate={isExpanded ? 'expanded' : 'collapsed'} variants={containerVariants} ref={parentRef}
      transition={containerTransition}>
      <SearchInputContainer>
        <SearchIcon>
          <IoSearch />
        </SearchIcon>
        <SearchInput ref={inputRef} onFocus={expandContainer}
          placeholder='Search for Series/Shows'
          value={searchQuery}
          onChange={handleChange}></SearchInput>
        <AnimatePresence>
          {isExpanded && (
            <CloseIcon key='close-icon' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={collapseContainer}>
              <IoClose />
            </CloseIcon>
          )}
        </AnimatePresence>
      </SearchInputContainer>
      {isExpanded && <LineSeperator />}
      {isExpanded && <SearchContent>
        {isLoading && (
          <LoadingWrapper>
            <PacmanLoader loading color='#000' size={20} />
          </LoadingWrapper>)}
        {!isLoading && isEmpty && !noFindings &&(
          <LoadingWrapper>
            <WarningMessage>Start typing to Search your TV Shows/ Series</WarningMessage>
          </LoadingWrapper>  

        )}    

        {!isLoading && noFindings &&(
        <LoadingWrapper>
        <WarningMessage>
          No TV Shows or Series are found. 
          </WarningMessage>
          </LoadingWrapper>)}  
        {!isLoading && !isEmpty && <>
          {tvShows.map((tvshow) =>
            <Tvshows
              key={tvshow.show.id}
              link = {tvshow.show.url}
              thumbnailSrc={tvshow.show.image && tvshow.show.image.medium}
              name={tvshow.show.name} rating={tvshow.show.rating && tvshow.show.rating.average}
              genre={tvshow.show.genres[0]}
            />)}
        </>}
      </SearchContent>}
    </SearchbarContainer>
  )
}

export default Searchbar 