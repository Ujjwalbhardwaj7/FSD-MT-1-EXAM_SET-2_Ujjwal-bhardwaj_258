# Student Record Management API

This API stores a few student records and lets us add, view, edit, delete, and filter them without a database.

## What I used

- Node.js (version 18 or later)
- Express.js
- A JavaScript array to hold the records while the server is running
- Postman or Thunder Client for checking the endpoints

No database is needed. The data returns to the three starting records whenever the server restarts.


## Endpoints

| Method | Route | Purpose | Successful status |
| --- | --- | --- | --- |
| GET | `/api/students` | Show all students | 200 |
| POST | `/api/students` | Add a new student | 201 |
| GET | `/api/students/:id` | Find one student | 200 |
| PUT | `/api/students/:id` | Replace one student's details | 200 |
| DELETE | `/api/students/:id` | Delete a student | 200 |
| GET | `/api/students/filter?branch=value` | Filter by branch (not case-sensitive) | 200 |

For a missing ID, the API responds with 404. Incorrect request data gives 400. An empty filter result is `[]` with status 200.

## Postman request examples

**POST** `http://localhost:3000/api/students`

Set Body -> raw -> JSON and paste:

```json
{
  "rollNumber": "IT2404",
  "name": "Meera Gupta",
  "branch": "IT",
  "semester": 3,
  "email": "meera@example.com"
}
```

**PUT** `http://localhost:3000/api/students/201`

Set Body -> raw -> JSON and paste:

```json
{
  "rollNumber": "CSE2401",
  "name": "Aarav Sharma",
  "branch": "CSE",
  "semester": 4,
  "email": "aarav.sharma@example.com"
}
```

**GET filter** `http://localhost:3000/api/students/filter?branch=cse`

**GET no match** `http://localhost:3000/api/students/filter?branch=MECH`

**GET missing ID** `http://localhost:3000/api/students/99999`

## Testing

Open another terminal in this same folder and run `npm test`. The automated tests check the six endpoints, invalid data, invalid IDs, filtering, and JSON responses. For the assignment, also test them manually in Postman or Thunder Client and save screenshots in the `screenshots` folder.

## What I learned

This exercise helped me understand the difference between GET, POST, PUT, and DELETE. I also learned how to read route parameters and query parameters, validate JSON data, and send the right HTTP status code.

## Submission

Upload `server.js`, `package.json`, `package-lock.json`, this `README.md`, and your own testing screenshots to your individual GitHub repository. Do not upload `node_modules`.
