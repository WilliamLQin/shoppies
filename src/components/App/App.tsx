import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './App.css';
import ResultsList from '../ResultsList/ResultsList';
import axios from 'axios';

export interface OMDbSearchResult {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

function App() {
  const [searchTitleValue, setSearchTitleValue] = useState("");
  const [searchYearValue, setSearchYearValue] = useState("");
  const [searchResults, setSearchResults] = useState([] as OMDbSearchResult[]);
  const [nominatedIDs, setNominatedIDs] = useState([] as string[]);

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
    setNominatedIDs([...nominatedIDs, movie.imdbID]);
  }

  useEffect(() => {
    axios.get(`http://www.omdbapi.com/?apikey=a5edf84d&type=movie&s=${searchTitleValue}${searchYearValue && `&y=${searchYearValue}`}`)
        .then(response => {
          if (response.data.Error) {
            console.log(response.data.Error);
            return;
          }
          var seenIDs: string[] = [];
          var searchResults: OMDbSearchResult[] = [];
          response.data.Search.map((movie: OMDbSearchResult) => {
            if (seenIDs.indexOf(movie.imdbID) === -1) {
              seenIDs.push(movie.imdbID);
              searchResults.push(movie);
            }
          })
          setSearchResults(searchResults);
        });
  }, [searchTitleValue, searchYearValue])

  useEffect(() => {
    console.log("update");
  }, [nominatedIDs])

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
              <ResultsList results={searchResults} nominated={nominatedIDs} onNominate={onNominate}/>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="paper">
              
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
