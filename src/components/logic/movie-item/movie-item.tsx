/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
import { Rate } from 'antd';
import { format } from 'date-fns';
import React from 'react';

import { IMovie } from '../../../types/types';
import { SwapiServiceConsumer } from '../swapi-service-context';

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

class MovieItem extends React.Component<MovieItemProps, MovieItemState> {
  state = {
    rating: this.props.movie.rating,
  };

  render() {
    const { movie } = this.props;
    const { rating } = this.state;
    const { id, title, releaseDate, genres, posterPath, overview } = movie;

    const formatDate = format(new Date(releaseDate), 'MMMM dd, yyyy');

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
      <SwapiServiceConsumer>
        {({ rateMovie, getGenre }) => {
          const genresArray = genres.map(getGenre);
          const genresList = genresArray.map((genre) => (
            <li key={genre} className="movie-item__genre">
              {genre}
            </li>
          ));

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
                    onChange={(value: number) => {
                      rateMovie(id, value);
                      this.setState({ rating: value });
                    }}
                  />
                </div>
              </div>
              <div className="clearfix" />
            </div>
          );
        }}
      </SwapiServiceConsumer>
    );
  }
}

export default MovieItem;
