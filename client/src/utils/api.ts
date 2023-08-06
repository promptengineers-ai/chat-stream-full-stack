
export async function getSources() {
	return fetch(`http://localhost:8000/vectorstores`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
	})
	.then(response => response.json())
	.catch(error => console.error('Error:', error));
}