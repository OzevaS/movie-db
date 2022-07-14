import React from 'react';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

import 'antd/dist/antd.css';

import './app.css';

import SearchPage from '../search-page';
import SwapiService from '../../../services/swapi-service';
import { SwapiServiceProvider } from '../swapi-service-context';
import Header from '../header';
import RatedPage from '../rated-page/rated-page';

interface AppState {
  selectedPage: string;
}

class App extends React.Component<Record<string, never>, AppState> {
  swapiService: SwapiService;

  state = {
    selectedPage: 'search',
  };

  constructor(props: any) {
    super(props);

    this.swapiService = new SwapiService('710d31b86117ffad2fa45c7c3c8020cf');
  }

  onSelectedPage = (key: string) => {
    switch (key) {
      case 'search':
        this.setState({ selectedPage: 'search' });
        break;
      case 'rated':
        this.setState({ selectedPage: 'rated' });
        break;
      default:
        break;
    }
  };

  render() {
    const { selectedPage } = this.state;

    let page = null;
    if (selectedPage === 'search') {
      page = <SearchPage />;
    }
    if (selectedPage === 'rated') {
      page = <RatedPage />;
    }

    return (
      <ErrorBoundary>
        <SwapiServiceProvider value={this.swapiService}>
          <div className="movie-db-app">
            <Header onSelect={this.onSelectedPage} />
            <div className="movie-db-app__content">{page}</div>
          </div>
        </SwapiServiceProvider>
      </ErrorBoundary>
    );
  }
}

export default App;
