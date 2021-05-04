import { OMDbSearchResult } from '../App/App';
import './ResultsList.css';

interface ResultsListProps {
  results: OMDbSearchResult[];
  nominated: string[];
  onNominate: (arg0: OMDbSearchResult) => void;
}

function ResultsList(props: ResultsListProps) {

  return (
    <ul>
      {props.results.map((movie) => {
        return (
          <li key={movie.imdbID}>
            {movie.Title} ({movie.Year}) &nbsp;
            <button disabled={props.nominated.indexOf(movie.imdbID) !== -1} onClick={() => {props.onNominate(movie)}}>
              Nominate
            </button>
          </li>
        )
      })}
    </ul>
  );
}

export default ResultsList;