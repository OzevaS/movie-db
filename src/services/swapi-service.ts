import { IGenre, IMovie, ISavedMovie } from '../types';

export default class MovieDBService {
  private _apiBase = 'https://api.themoviedb.org';

  private _apiKey: string;

  private _sessionId: string;

  private _createdSession: boolean;

  private _genresList: IGenre[] = [];

  private async createSession() {
    const urlRequest = this.getURLRequest('/authentication/guest_session/new');

    const body = await this.getResource(urlRequest);

    const { success, guest_session_id: sessionId } = body;

    if (!success) throw new Error('Could not create session');

    this._sessionId = sessionId;
    this._createdSession = true;
  }

  private async getGenres() {
    const urlRequest = this.getURLRequest('/genre/movie/list');

    const body = await this.getResource(urlRequest);

    return body.genres;
  }

  private getSavedMovies() {
    if (localStorage.getItem('movies') === null) {
      localStorage.setItem('movies', JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem('movies') as string);
  }

  private saveMovie(movie: ISavedMovie) {
    const { id, rating } = movie;

    if (rating === undefined) return;

    const movieToSave: ISavedMovie = {
      id,
      rating,
    };

    const savedMovies = this.getSavedMovies();

    const index = savedMovies.findIndex((m: ISavedMovie) => m.id === id);
    if (index === -1) savedMovies.push(movieToSave);
    else savedMovies[index] = movieToSave;

    localStorage.setItem('movies', JSON.stringify(savedMovies));
  }

  constructor(apiKey: string) {
    this._apiKey = apiKey;

    this.getGenres().then((genres) => {
      this._genresList = genres;
    });

    this._sessionId = '';
    this._createdSession = false;

    const sessionId = window.localStorage.getItem('sessionId');
    if (sessionId !== null) {
      this._sessionId = sessionId;
      this._createdSession = true;
    } else {
      this.createSession().then(() => {
        window.localStorage.setItem('sessionId', this._sessionId);
      });
    }
  }

  getURLRequest(pathname: string) {
    const urlRequest = new URL(`/3${pathname}`, this._apiBase);
    urlRequest.searchParams.set('api_key', this._apiKey);
    return urlRequest;
  }

  async getResource(url: string | URL) {
    const res = await fetch(url);

    if (!res.ok)
      throw new Error(`Could not fetch ${url} 
      received ${res.status}`);
    const body = await res.json();
    return body;
  }

  _transformMovie = (movie: any): IMovie => {
    let rating = 0;

    const savedMovies = this.getSavedMovies();
    if (savedMovies) {
      const index = savedMovies.findIndex((m: IMovie) => m.id === movie.id);
      if (index !== -1) rating = savedMovies[index].rating;
    }

    return {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      overview: movie.overview,
      genres: movie.genre_ids,
      posterPath: this._transformPosterPath(movie.poster_path),
      rating,
    };
  };

  _transformPosterPath = (posterPath: string) => {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  searchMovie = async (query: string, page: number) => {
    if (!this._createdSession) return null;

    const urlRequest = this.getURLRequest('/search/movie');
    urlRequest.searchParams.set('query', query);
    urlRequest.searchParams.set('page', String(page));

    const body = await this.getResource(urlRequest);

    return body.results.map(this._transformMovie);
  };

  getRatedMovies = async (page: number) => {
    if (!this._createdSession) return null;

    const urlRequest = this.getURLRequest(`/guest_session/${this._sessionId}/rated/movies`);
    urlRequest.searchParams.set('page', String(page));

    const body = await this.getResource(urlRequest);

    return body.results.map((item: any) => {
      const movie = this._transformMovie(item);
      movie.rating = item.rating;
      return movie;
    });
  };

  rateMovie = async (movieId: number, rating: number) => {
    const urlRequest = this.getURLRequest(`/movie/${movieId}/rating`);
    urlRequest.searchParams.set('guest_session_id', this._sessionId);
    urlRequest.searchParams.set('value', String(rating));

    fetch(urlRequest, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: rating }),
    }).then((res) => {
      if (!res.ok) throw new Error(`Could not rate movie ${movieId}`);
      this.saveMovie({ id: movieId, rating });
    });
  };

  getGenre = (genreId: number): string => {
    const found = this._genresList.find((genre) => genre.id === genreId);
    return found ? found.name : 'Unknown';
  };
}
