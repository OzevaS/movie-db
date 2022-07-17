import React, { FC, useMemo, useState } from 'react';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

import 'antd/dist/antd.css';

import './app.css';

import SearchPage from '../search-page';
import MovieDBService from '../../../services';
import SwapiServiceContext from '../movie-db-service-context';
import Header from '../header';
import RatedPage from '../rated-page/rated-page';

interface AppState {
  selectedPage: string;
}

const App: FC = () => {
  const swapiService = useMemo(() => new MovieDBService('710d31b86117ffad2fa45c7c3c8020cf'), []);

  const [selectedPage, setSelectedPage] = useState<AppState['selectedPage']>('search');

  const onSelectPage = (page: AppState['selectedPage']) => {
    setSelectedPage(page);
  };

  return (
    <SwapiServiceContext.Provider value={swapiService}>
      <ErrorBoundary>
        <section className="movie-db-app">
          <Header onSelect={onSelectPage} />
          {selectedPage === 'search' && <SearchPage />}
          {selectedPage === 'rated' && <RatedPage />}
        </section>
      </ErrorBoundary>
    </SwapiServiceContext.Provider>
  );
};

export default App;
