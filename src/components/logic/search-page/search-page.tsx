import React from 'react';
import { Input, Pagination } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

import './search-page.css';

import { IMovie } from '../../../types';
import { SwapiServiceConsumer } from '../swapi-service-context';
import { MovieListWithData } from '../sw-components';

interface SearchPageState {
  page: number;
  totalPages: number;
  query: string;
}

interface SearchPageProps {
  debounceTime?: number;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  state = {
    page: 1,
    totalPages: 0,
    query: '',
  };

  static defaultProps = {
    debounceTime: 2000,
  };

  searchMovie!: (query: string, page: number) => Promise<Array<IMovie>>;

  onSearchMovies!: (this: SearchPage, ...rest: any[]) => void;

  constructor(props: SearchPageProps) {
    super(props);

    const { debounceTime } = props;
    this.onSearchMovies = this.debounce(this._onSearchMovies, debounceTime as number);
  }

  shouldComponentUpdate(nextProps: SearchPageProps, nextState: SearchPageState) {
    const { query } = this.state;
    const { query: nextQuery } = nextState;

    return query !== nextQuery;
  }

  debounce = (fn: (...args: any[]) => void, ms: number) => {
    let currentTimeout: NodeJS.Timeout | null = null;

    return function wrapper(this: SearchPage, ...rest: any[]) {
      clearTimeout(currentTimeout as NodeJS.Timeout);

      currentTimeout = setTimeout(() => {
        fn.apply(this, rest);
      }, ms);
    };
  };

  _onSearchMovies = (query: string) => {
    if (!query) return;

    this.setState({ query });
  };

  onPageChange = (page: number) => {
    this.setState({ page });
  };

  getMovies = () => {
    const { query, page } = this.state;

    if (!query) return Promise.resolve([]);

    const promise = this.searchMovie(query, page);

    return promise;
  };

  render() {
    const { totalPages } = this.state;

    return (
      <ErrorBoundary>
        <SwapiServiceConsumer>
          {({ searchMovie }) => {
            this.searchMovie = searchMovie;

            return (
              <section className="movie-db-app__search">
                <Input
                  className="search-movie"
                  onChange={(e) => this.onSearchMovies(e.target.value)}
                  placeholder="type to search..."
                />
                <MovieListWithData promise={this.getMovies()} />
                <Pagination
                  className="movie-db-app__pagination"
                  defaultCurrent={1}
                  total={totalPages}
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

export default SearchPage;
