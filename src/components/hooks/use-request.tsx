/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useMemo, useState } from 'react';

import { IDataState } from '../../types';

const useRequest = (request: () => Promise<any>): IDataState => {
  const initialState = useMemo(
    () => ({
      data: null,
      loading: true,
      error: null,
    }),
    []
  );

  const [dataState, setDataState] = useState(initialState);

  useEffect(() => {
    setDataState(initialState);

    let cancelled = false;
    request()
      .then((data) => {
        if (!cancelled)
          setDataState({
            data,
            error: null,
            loading: false,
          });
      })
      .catch((error) => {
        if (!cancelled)
          setDataState({
            data: null,
            error,
            loading: false,
          });
      });

    return () => {
      cancelled = true;
    };
  }, [request, initialState]);

  return dataState;
};

export default useRequest;
