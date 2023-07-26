function getSources() {
	return fetch(`/vectorstores`, {
			method: 'GET',
			headers: {
					'Content-Type': 'application/json',
			}
	})
	.then(response => response.json())  
	.catch(error => console.error('Error:', error));
}