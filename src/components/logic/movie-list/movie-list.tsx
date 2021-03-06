import React, { FC } from 'react';
import { Row, Col } from 'antd';

import './movie-list.css';

import { IMovie } from '../../../types/types';
import MovieItem from '../movie-item';

interface MovieListProps {
  data: {
    movies: Array<IMovie> | null;
  };
}

const MovieList: FC<MovieListProps> = ({ data }) => {
  const moviesElements = data?.movies
    ? data.movies.map((item) => {
        return (
          <Col className="gutter-row" key={item.id} lg={12} xs={24}>
            <MovieItem movie={item} />
          </Col>
        );
      })
    : null;

  return (
    <Row className="movie-list" gutter={[36, 35]}>
      {moviesElements}
    </Row>
  );
};

export default MovieList;
