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
  const { userRating, globalRating } = movie;

  const [userRatingState, setUserRatingState] = React.useState<MovieItemState['rating']>(userRating);

  const { rateMovie, getGenre } = React.useContext(MovieDBServiceContext);

  const onRate = useCallback(
    (id: number, value: number) => {
      setUserRatingState(value);
      rateMovie(id, value);
    },
    [rateMovie]
  );

  const genresArray = useMemo((): string[] => movie.genres.map(getGenre), [movie.genres, getGenre]);

  return (
    <MovieItemView
      movie={movie}
      userRating={userRatingState}
      globalRating={globalRating}
      genresArray={genresArray}
      rateMovie={onRate}
    />
  );
};

interface MovieItemViewProps {
  movie: IMovie;
  userRating: number;
  globalRating: number;
  rateMovie: (id: number, value: number) => void;
  genresArray: string[];
}

const MovieItemView: FC<MovieItemViewProps> = ({ movie, userRating, globalRating, rateMovie, genresArray }) => {
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

  const classNameGlobalRating = `movie-item__rating ${
    globalRating >= 7
      ? 'movie-item__rating--high'
      : globalRating >= 5
      ? 'movie-item__rating--good'
      : globalRating >= 3
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
          <div className={classNameGlobalRating}>{globalRating}</div>
        </div>
        <div className="movie-item__body">
          <p className="movie-item__overview">{sliceOverview(overview, 150)}</p>
          <Rate
            className="movie-item__rate-movie"
            allowHalf
            count={10}
            value={userRating}
            onChange={(value) => rateMovie(id, value)}
          />
        </div>
      </div>
      <div className="clearfix" />
    </div>
  );
};

export default MovieItem;
