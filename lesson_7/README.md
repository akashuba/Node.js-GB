## REST API:  

### Registration
`POST, http://localhost:3000/register`
```
{
	email: string,
	fullName: string,
	password: string,
	repassword: string,
}
```
### Authorization
`POST, http://localhost:3000/auth`
```
{
	username: string, (email)
	password: string
}
```

### Fetch tasks or one task
`GET, http://localhost:4000/tasks/:id`
```
{
	Authorization: Bearer <token>,
}
```
### Save task
`POST, http://localhost:4000/tasks`
```
{
	Authorization: Bearer <token>,
	title: string,
	isFinished: boolean
}
```
### Change task state
`PUT, http://localhost:4000/tasks`
```
{
	Authorization: Bearer <token>,
	"_id": <task_id>,
	"isFinished": boolean,
}
```
### Delete task
`DELETE, http://localhost:4000/tasks`
```
{
	Authorization: Bearer <token>,
	"_id": <task_id>,
}
```
