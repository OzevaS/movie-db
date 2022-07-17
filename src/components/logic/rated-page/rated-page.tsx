/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, useCallback } from 'react';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import { Pagination } from 'antd';

import './rated-page.css';

import MovieDBServiceContext from '../movie-db-service-context';
import { useRequest } from '../../hooks';
import { MovieListData } from '../../hoc/hoc-components';

interface RatedPageState {
  page: number;
  totalPages: number;
}

const RatedPage: FC = () => {
  const { getRatedMovies } = React.useContext(MovieDBServiceContext);

  const [page, setPage] = React.useState<RatedPageState['page']>(1);

  const onChangePage = (page: number) => {
    setPage(page);
  };

  const request = useCallback(() => {
    return getRatedMovies(page);
  }, [page, getRatedMovies]);

  const dataState = useRequest(request);

  const totalPages = dataState.data?.totalPages || 0;

  return (
    <ErrorBoundary>
      <MovieListData {...dataState} />
      <Pagination
        className="movie-db-app__pagination"
        defaultCurrent={page}
        total={totalPages}
        onChange={onChangePage}
      />
    </ErrorBoundary>
  );
};

export default RatedPage;
