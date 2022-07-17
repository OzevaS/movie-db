import React from 'react';

import MovieDBService from '../../../services';

const MovieDBServiceContext = React.createContext<MovieDBService>(null as any);

export default MovieDBServiceContext;
