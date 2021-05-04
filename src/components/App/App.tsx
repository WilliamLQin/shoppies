import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './App.css';
import ResultsList from '../ResultsList/ResultsList';
import NominationsList from '../NominationsList/NominationsList';
import axios from 'axios';

export interface OMDbSearchResult {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

const NOMINATIONS_LOCAL_STORAGE_KEY = "nominations";
const NOMINATIONS_REQUIRED = 5;

function App() {
  const [searchTitleValue, setSearchTitleValue] = useState("");
  const [searchYearValue, setSearchYearValue] = useState("");
  const [searchResults, setSearchResults] = useState([] as OMDbSearchResult[]);
  const [nominatedMovies, setNominatedMovies] = useState([] as OMDbSearchResult[]);
  const [doneNominating, setDoneNominating] = useState(false);

  const handleSearchTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchTitleValue(event.currentTarget.value);
  }

  const handleSearchYearChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchYearValue(event.currentTarget.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const onNominate = (movie: OMDbSearchResult) => {
    setNominatedMovies([...nominatedMovies, movie]);
  }

  const onRemove = (movie: OMDbSearchResult) => {
    setNominatedMovies(nominatedMovies.filter(val => val.imdbID !== movie.imdbID));
  }

  // Initial set up first before anything else modifies local storage
  useEffect(() => {
    const retrievedNominations = localStorage.getItem(NOMINATIONS_LOCAL_STORAGE_KEY);
    if (retrievedNominations) {
      setNominatedMovies(JSON.parse(retrievedNominations));
    }
  }, [])

  useEffect(() => {
    // API keys aren't secure on client so we can just hardcode it here
    axios.get(`http://www.omdbapi.com/?apikey=a5edf84d&type=movie&s=${searchTitleValue}${searchYearValue && `&y=${searchYearValue}`}`)
        .then(response => {
          if (response.data.Error) {
            console.log(response.data.Error);
            setSearchResults([]);
            return;
          }
          var seenIDs: string[] = [];
          var searchResults: OMDbSearchResult[] = [];
          response.data.Search.forEach((movie: OMDbSearchResult) => {
            if (seenIDs.indexOf(movie.imdbID) === -1) {
              seenIDs.push(movie.imdbID);
              searchResults.push(movie);
            }
          })
          setSearchResults(searchResults);
        });
  }, [searchTitleValue, searchYearValue])

  useEffect(() => {
    if (nominatedMovies.length >= NOMINATIONS_REQUIRED && !doneNominating) {
      setDoneNominating(true);
      alert("5 nominations complete. Thank you for your input on the upcoming Shoppies! You can continue to add nominations if you wish.");
    } else if (nominatedMovies.length < NOMINATIONS_REQUIRED) {
      setDoneNominating(false);
    }
    localStorage.setItem(NOMINATIONS_LOCAL_STORAGE_KEY, JSON.stringify(nominatedMovies));
  }, [nominatedMovies, doneNominating])

  return (
    <div className="App">
      <div className="App-content">
        <header className="App-header">
          The Shoppies
        </header>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className="paper search">
              <form className="search-title" onSubmit={handleSubmit}>
                <label>
                  Movie title
                </label>
                <input type="text" value={searchTitleValue} onChange={handleSearchTitleChange} />
              </form>
              <form className="search-year" onSubmit={handleSubmit}>
                <label>
                  Movie year
                </label>
                <input type="text" placeholder="Leave empty for any year" value={searchYearValue} onChange={handleSearchYearChange} />
              </form>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="paper">
              <div className="section-header">
                Results for "{searchTitleValue}" {searchYearValue && `(${searchYearValue})`}
              </div>
              <ResultsList results={searchResults} nominated={nominatedMovies} onNominate={onNominate}/>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="paper">
              <div className="section-header">
                Nominations {nominatedMovies.length >= NOMINATIONS_REQUIRED ? "(Complete)" : `(${NOMINATIONS_REQUIRED - nominatedMovies.length} more to go)`}
              </div>
              <NominationsList nominated={nominatedMovies} onRemove={onRemove} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
