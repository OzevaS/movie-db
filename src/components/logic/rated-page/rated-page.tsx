import React from 'react';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import { Pagination } from 'antd';

import './rated-page.css';

import { IMovie } from '../../../types';
import { SwapiServiceConsumer } from '../swapi-service-context';
import { MovieListWithData } from '../sw-components';

interface RatedPageState {
  page: number;
}

class RatedPage extends React.Component<Record<string, never>, RatedPageState> {
  state = {
    page: 1,
  };

  getRatedMovies!: (page: number) => Promise<Array<IMovie>>;

  onPageChange = (page: number) => {
    this.setState({ page });
  };

  getMovies = () => {
    const { page } = this.state;

    return this.getRatedMovies(page);
  };

  render() {
    return (
      <ErrorBoundary>
        <SwapiServiceConsumer>
          {({ getRatedMovies }) => {
            this.getRatedMovies = getRatedMovies;

            return (
              <section className="movie-db-app__search">
                <MovieListWithData promise={this.getMovies()} />
                <Pagination
                  className="movie-db-app__pagination"
                  defaultCurrent={1}
                  total={50}
                  onChange={this.onPageChange}
                />
              </section>
            );
          }}
        </SwapiServiceConsumer>
      </ErrorBoundary>
    );
  }
}

export default RatedPage;
