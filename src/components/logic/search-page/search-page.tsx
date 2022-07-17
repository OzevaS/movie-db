/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, useCallback, useEffect } from 'react';
import { Input, Pagination } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

import './search-page.css';

import MovieDBServiceContext from '../movie-db-service-context';
import { useRequest } from '../../hooks';
import { MovieListData } from '../../hoc/hoc-components';

interface SearchPageState {
  page: number;
  query: string;
}

interface SearchPageProps {
  debounceTime?: number;
}

const SearchPage: FC<SearchPageProps> = ({ debounceTime }) => {
  const { searchMovie } = React.useContext(MovieDBServiceContext);

  const [page, setPage] = React.useState<SearchPageState['page']>(1);
  const [query, setQuery] = React.useState<SearchPageState['query']>('');

  const onChangePage = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    setPage(1);
  }, [query]);

  const onSearchMovies = useCallback(
    debounce((query: string) => {
      if (!query) return;

      setQuery(query);
    }, debounceTime as number),
    [debounceTime]
  );

  const request = useCallback(() => {
    if (!query)
      return new Promise((resolve) => {
        resolve(null);
      });
    return searchMovie(query, page);
  }, [query, page, searchMovie]);

  const dataState = useRequest(request);

  const totalPages = dataState.data?.totalPages || 0;

  return (
    <ErrorBoundary>
      <section className="movie-db-app__search">
        <Input
          className="search-movie"
          onChange={(e) => onSearchMovies(e.target.value)}
          placeholder="type to search..."
        />
        <MovieListData {...dataState} />
        <Pagination
          className="movie-db-app__pagination"
          defaultCurrent={page}
          total={totalPages}
          onChange={onChangePage}
        />
      </section>
    </ErrorBoundary>
  );
};

SearchPage.defaultProps = {
  debounceTime: 2000,
};

function debounce(fn: (...args: any) => void, ms: number) {
  let currentTimeout: NodeJS.Timeout | null = null;

  return function wrapper(this: any, ...rest: any) {
    clearTimeout(currentTimeout as NodeJS.Timeout);

    currentTimeout = setTimeout(() => {
      fn.apply(this, rest);
    }, ms);
  };
}

export default SearchPage;
