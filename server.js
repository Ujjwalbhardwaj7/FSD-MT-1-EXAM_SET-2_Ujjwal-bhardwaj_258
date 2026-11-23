const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Starting records are stored in memory, not in a database.
let students = [
  {
    "id": 201,
    "rollNumber": "CSE2401",
    "name": "Aarav Sharma",
    "branch": "CSE",
    "semester": 3,
    "email": "aarav@example.com"
  },
  {
    "id": 202,
    "rollNumber": "ECE2402",
    "name": "Diya Verma",
    "branch": "ECE",
    "semester": 3,
    "email": "diya@example.com"
  },
  {
    "id": 203,
    "rollNumber": "CSE2403",
    "name": "Kabir Singh",
    "branch": "CSE",
    "semester": 3,
    "email": "kabir@example.com"
  }
];
let nextId = 204;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateStudent(data, currentId = null) {
  if (!isObject(data)) return 'Please send a valid student object.';
  if (typeof data.rollNumber !== 'string' || !data.rollNumber.trim()) return 'Roll number is required.';
  if (typeof data.name !== 'string' || !data.name.trim()) return 'Name is required.';
  if (typeof data.branch !== 'string' || !data.branch.trim()) return 'Branch is required.';
  if (!Number.isInteger(data.semester) || data.semester < 1) return 'Semester must be a positive whole number.';
  if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return 'Enter a valid email address.';
  }
  const used = students.some(student =>
    student.id !== currentId &&
    student.rollNumber.toLowerCase() === data.rollNumber.trim().toLowerCase()
  );
  if (used) return 'This roll number already exists.';
  return null;
}

function cleanStudent(data) {
  return {
    rollNumber: data.rollNumber.trim(),
    name: data.name.trim(),
    branch: data.branch.trim(),
    semester: data.semester,
    email: data.email.trim()
  };
}

// GET all students
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// Put this route above /:id, so "filter" is not treated as an ID.
app.get('/api/students/filter', (req, res) => {
  const value = req.query.branch;
  if (typeof value !== 'string' || !value.trim()) {
    return res.status(400).json({ error: 'Please provide a branch query parameter.' });
  }

  // A partial match is allowed, and uppercase/lowercase does not matter.
  const search = value.trim().toLowerCase();
  const matches = students.filter(item => item.branch.toLowerCase().includes(search));
  res.status(200).json(matches);
});

// GET one student by ID
app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = students.find(item => item.id === id);
  if (!found) return res.status(404).json({ error: 'Student not found.' });
  res.status(200).json(found);
});

// POST a new student
app.post('/api/students', (req, res) => {
  const error = validateStudent(req.body);
  if (error) return res.status(400).json({ error });

  const created = { id: nextId++, ...cleanStudent(req.body) };
  students.push(created);
  res.status(201).json(created);
});

// PUT an updated student
app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found.' });

  const error = validateStudent(req.body, id);
  if (error) return res.status(400).json({ error });

  students[index] = { id, ...cleanStudent(req.body) };
  res.status(200).json(students[index]);
});

// DELETE a student
app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found.' });

  students.splice(index, 1);
  res.status(200).json({ message: 'Student deleted successfully.' });
});

// Send a helpful JSON error if the request body is not valid JSON.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }
  next(err);
});

// Running this file directly starts the API.
// Exporting the app also lets the tests use a free local port.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
}

module.exports = app;
