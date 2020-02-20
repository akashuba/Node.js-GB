console.log('script is here');

const form = document.querySelector('#form');

function onCheckboxClick(target) {
	const data = {
		title: target.nextElementSibling.innerText,
		isFinished: target.checked,
	}

	fetch('http://localhost:3000/tasks', {
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
		title: target.previousElementSibling.innerText,
	}

	fetch('http://localhost:3000/tasks', {
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

	fetch('http://localhost:3000/tasks', {
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
