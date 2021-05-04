import { OMDbSearchResult } from '../App/App';
import './ResultsList.css';

interface ResultsListProps {
  results: OMDbSearchResult[];
  nominated: OMDbSearchResult[];
  onNominate: (arg0: OMDbSearchResult) => void;
}

function ResultsList(props: ResultsListProps) {

  const nominatedIDs = props.nominated.map(val => val.imdbID);

  return (
    <ul>
      {props.results.map((movie) => {
        return (
          <li key={movie.imdbID}>
            {movie.Title} ({movie.Year}) &nbsp;
            <button disabled={nominatedIDs.indexOf(movie.imdbID) !== -1} onClick={() => {props.onNominate(movie)}}>
              Nominate
            </button>
          </li>
        )
      })}
    </ul>
  );
}

export default ResultsList;