/* eslint-disable no-restricted-syntax */
const getQueryParams = params => {
  if (!params) return '';

  let formatParams = '?';

  for (const [key, value] of Object.entries(params)) {
    formatParams += `${key}=${value}&`;
  }

  return formatParams.slice(0, -1);
};

export default getQueryParams;
