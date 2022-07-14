import React from 'react';

import SwapiService from '../../../services/swapi-service';

const { Provider: SwapiServiceProvider, Consumer: SwapiServiceConsumer } = React.createContext<SwapiService>(
  null as any
);

export { SwapiServiceProvider, SwapiServiceConsumer };
