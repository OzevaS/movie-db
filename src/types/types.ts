/* eslint-disable import/prefer-default-export */
interface IMovie {
  id: number;
  title: string;
  releaseDate: string;
  overview: string;
  genres: number[];
  posterPath: string;
  globalRating: number;
  userRating: number;
}

interface IGenre {
  id: number;
  name: string;
}

interface ISavedMovie {
  id: number;
  userRating: number;
}

interface IMoviesInfo {
  movies: IMovie[];
  totalPages: number;
}

interface IDataState {
  data: any;
  loading: boolean;
  error: Error | null;
}

export type { IMovie, IGenre, ISavedMovie, IDataState, IMoviesInfo };
