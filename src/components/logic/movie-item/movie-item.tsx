/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
import { Rate } from 'antd';
import { format } from 'date-fns';
import React, { FC, useCallback, useMemo } from 'react';

import { IMovie } from '../../../types/types';
import MovieDBServiceContext from '../movie-db-service-context';

import './movie-item.css';

interface MovieItemProps {
  movie: IMovie;
}

interface MovieItemState {
  rating: number;
}

function sliceOverview(text: string, max: number) {
  if (text.length <= max) return text;

  const last: string = text[max - 1];
  let lastIndex = max - 1;
  if (/[a-z]/i.test(last)) lastIndex = text.lastIndexOf(' ', max - 1);

  return `${text.slice(0, lastIndex)}...`;
}

const MovieItem: FC<MovieItemProps> = ({ movie }) => {
  const { rating: ratingMovie } = movie;

  const [ratingState, setRatingState] = React.useState<MovieItemState['rating']>(ratingMovie);

  const { rateMovie, getGenre } = React.useContext(MovieDBServiceContext);

  const onRate = useCallback(
    (id: number, value: number) => {
      setRatingState(value);
      rateMovie(id, value);
    },
    [rateMovie]
  );

  const genresArray = useMemo((): string[] => movie.genres.map(getGenre), [movie.genres, getGenre]);

  return <MovieItemView movie={movie} rating={ratingState} genresArray={genresArray} rateMovie={onRate} />;
};

interface MovieItemViewProps {
  movie: IMovie;
  rating: number;
  rateMovie: (id: number, value: number) => void;
  genresArray: string[];
}

const MovieItemView: FC<MovieItemViewProps> = ({ movie, rating, rateMovie, genresArray }) => {
  const { id, title, releaseDate, posterPath, overview } = movie;

  const formatDate = useMemo(() => format(new Date(releaseDate), 'MMMM dd, yyyy'), [releaseDate]);

  const genresList = useMemo(
    () =>
      genresArray.map((genre) => (
        <li key={genre} className="movie-item__genre">
          {genre}
        </li>
      )),
    [genresArray]
  );

  const classNameRating = `movie-item__rating ${
    rating >= 7
      ? 'movie-item__rating--high'
      : rating >= 5
      ? 'movie-item__rating--good'
      : rating >= 3
      ? 'movie-item__rating--normal'
      : 'movie-item__rating--bad'
  }`;

  return (
    <div className="movie-item">
      <img className="movie-item__img" src={posterPath} alt="poster" />
      <div className="movie-item__content">
        <div className="movie-item__header">
          <h3 className="movie-item__title">{title}</h3>
          <p className="movie-item__date">{formatDate}</p>
          <ul className="movie-item__genres">{genresList}</ul>
          <div className={classNameRating}>{rating}</div>
        </div>
        <div className="movie-item__body">
          <p className="movie-item__overview">{sliceOverview(overview, 150)}</p>
          <Rate
            className="movie-item__rate-movie"
            allowHalf
            count={10}
            value={rating}
            onChange={(value) => rateMovie(id, value)}
          />
        </div>
      </div>
      <div className="clearfix" />
    </div>
  );
};

export default MovieItem;
