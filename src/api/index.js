export function query({ query, variables = null }) {
  const token = localStorage.getItem('authToken');
  return fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      query,
      ...variables && {
        variables,
      }
    })
  })
    .then(resp => resp.json());
}
