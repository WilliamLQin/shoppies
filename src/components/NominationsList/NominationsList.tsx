import { OMDbSearchResult } from '../App/App';
import './NominationsList.css';

interface NominationsListProps {
  nominated: OMDbSearchResult[];
  onRemove: (arg0: OMDbSearchResult) => void;
}

function NominationsList(props: NominationsListProps) {

  return (
    <ul>
      {props.nominated.map((movie) => {
        return (
          <li key={movie.imdbID}>
            {movie.Title} ({movie.Year}) &nbsp;
            <button onClick={() => {props.onRemove(movie)}}>
              Remove
            </button>
          </li>
        )
      })}
    </ul>
  );
}

export default NominationsList;