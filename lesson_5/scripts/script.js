console.log('script is here');

const form = document.querySelector('#form');

function onCheckboxClick(target) {
	const data = {
		_id: target.nextElementSibling.nextElementSibling.value,
		isFinished: target.checked,
	}

	fetch('http://localhost:3000/task', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		  },
		body: JSON.stringify(data),
	}).catch((error) => {
		console.log(error)
	})
}

function onRemoveClick(target) {
	const data = {
		_id: target.previousElementSibling.value,
	}

	fetch('http://localhost:3000/task', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		  },
		body: JSON.stringify(data),
	}).then(() => {
		location.reload();
	}).catch((error) => {
		console.log(error)
	})
}

form.addEventListener('submit', (event) => {
	event.preventDefault();
	
	const data = {
		title: form.querySelector('#title').value,
		isFinished: form.querySelector('#checkbox').checked,
	}

	fetch('http://localhost:3000/task', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		  },
		body: JSON.stringify(data),
	}).then(() => {
		location.reload();
	}).catch((error) => {
		console.log(error)
	})
})
