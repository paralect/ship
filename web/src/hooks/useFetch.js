import { useEffect, useReducer } from 'react';

const reducerFunc = (prevState, newState) => ({
  ...prevState,
  ...newState,
});

const initialReducerState = {
  data: null,
  loading: true,
  error: null,
};

export const useFetch = (fetchFunc, {
  onSuccess, onError, onFinish, params, enabled = true,
}) => {
  const [{ data, loading, error }, setState] = useReducer(reducerFunc, initialReducerState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ loading: true });
        let response;
        if (typeof fetchFunc === 'function') {
          response = await fetchFunc(params);
        } else {
          response = await Promise.all(fetchFunc);
        }
        setState({ data: response, loading: false });
        if (onSuccess) onSuccess();
      } catch (err) {
        setState({ error: err, loading: false });
        if (onError) onError();
      } finally {
        if (onFinish) onFinish();
      }
    };

    if (enabled) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), enabled]);

  return { data, loading, error };
};
