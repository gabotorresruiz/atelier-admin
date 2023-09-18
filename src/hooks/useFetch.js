import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser, getQueryParams } from '../utils';

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

const useFetch = ({
  entity,
  fetchMethod,
  id = 0,
  fetchParams = null,
  headerOrigin = undefined,
}) => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState(fetchMethod);
  const [params, setParams] = useState(fetchParams);
  const [bodyFetch, setBodyFetch] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const doFetch = useCallback(
    ({ body = undefined, refresh = false, newParams = null }) => {
      setMethod(fetchMethod);
      setError(null);
      if (body) setBodyFetch(body);
      if (refresh) setRefreshData(true);
      if (newParams) setParams(newParams);

      setIsLoading(true);
    },
    [fetchMethod],
  );

  const fetchData = useCallback(
    async (uri, options) => {
      try {
        const res = await fetch(uri, options);

        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          return navigate('/login');
        }

        if (!res.ok) throw new Error(res.statusText);

        if (res.status === 201 || res.status === 204) {
          setIsLoading(false);
          setResponse({ status: res.status });
          return;
        }

        const data = await res.json();

        setResponse(data);
      } catch (err) {
        const data = err.response ? err.response.data : err;

        setResponse(null);
        setError(data);
      }

      setIsLoading(false);
    },
    [navigate],
  );

  useEffect(() => {
    const loggedUser = getLoggedUser();
    const headers = loggedUser?.token
      ? {
          Authorization: `Bearer ${loggedUser.token}`,
          'Content-Type': 'application/json',
        }
      : {
          'x-origin': headerOrigin,
          'Content-Type': 'application/json',
        };

    const options =
      method === 'POST' || method === 'PUT'
        ? {
            method,
            headers,
            body: JSON.stringify(bodyFetch),
          }
        : {
            method,
            headers,
          };

    let uri = id
      ? `${API_BASE_URI}/${entity}/${id}`
      : `${API_BASE_URI}/${entity}`;

    if (params) uri += getQueryParams(params);
    if (method === 'GET' && !refreshData) {
      fetchData(uri, options);
      return;
    }

    if (isLoading) fetchData(uri, options);
  }, [
    bodyFetch,
    entity,
    fetchData,
    headerOrigin,
    id,
    isLoading,
    method,
    params,
    refreshData,
  ]);

  return [{ response, error, isLoading }, doFetch];
};

export default useFetch;
