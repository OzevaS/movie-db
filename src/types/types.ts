/* eslint-disable import/prefer-default-export */
interface IMovie {
  id: number;
  title: string;
  releaseDate: string;
  overview: string;
  genres: number[];
  posterPath: string;
  rating: number;
}

interface IGenre {
  id: number;
  name: string;
}

interface ISavedMovie {
  id: number;
  rating: number;
}

export type { IMovie, IGenre, ISavedMovie };
