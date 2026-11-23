const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

let server;
let base;

before(async () => {
  server = await new Promise(resolve => {
    const running = app.listen(0, () => resolve(running));
  });
  base = `http://127.0.0.1:${server.address().port}/api/students`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
});

async function request(method, path = '', data) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data !== undefined) options.body = JSON.stringify(data);
  const response = await fetch(base + path, options);
  return { status: response.status, json: await response.json() };
}

test('GET all returns the three starting records', async () => {
  const result = await request('GET');
  assert.equal(result.status, 200);
  assert.equal(result.json.length, 3);
});

test('GET by ID returns an existing record', async () => {
  const result = await request('GET', '/201');
  assert.equal(result.status, 200);
  assert.equal(result.json.id, 201);
});

test('GET invalid ID returns 404', async () => {
  const result = await request('GET', '/99999');
  assert.equal(result.status, 404);
});

test('Filter is case-insensitive', async () => {
  const result = await request('GET', '/filter?branch=cse');
  assert.equal(result.status, 200);
  assert.ok(result.json.length >= 1);
});

test('Filter returns an empty array when nothing matches', async () => {
  const result = await request('GET', '/filter?branch=MECH');
  assert.equal(result.status, 200);
  assert.deepEqual(result.json, []);
});

test('POST rejects an invalid body', async () => {
  const result = await request('POST', '', {
    "rollNumber": "",
    "name": "Meera Gupta",
    "branch": "IT",
    "semester": 3,
    "email": "meera@example.com"
  });
  assert.equal(result.status, 400);
});

test('POST creates a record with a new numeric ID', async () => {
  const result = await request('POST', '', {
    "rollNumber": "IT2404",
    "name": "Meera Gupta",
    "branch": "IT",
    "semester": 3,
    "email": "meera@example.com"
  });
  assert.equal(result.status, 201);
  assert.equal(typeof result.json.id, 'number');
  assert.equal(result.json.id, 204);
});

test('PUT returns 404 when the ID does not exist', async () => {
  const result = await request('PUT', '/99999', {
    "rollNumber": "CSE2401",
    "name": "Aarav Sharma",
    "branch": "CSE",
    "semester": 4,
    "email": "aarav.sharma@example.com"
  });
  assert.equal(result.status, 404);
});

test('PUT replaces an existing record', async () => {
  const result = await request('PUT', '/201', {
    "rollNumber": "CSE2401",
    "name": "Aarav Sharma",
    "branch": "CSE",
    "semester": 4,
    "email": "aarav.sharma@example.com"
  });
  assert.equal(result.status, 200);
  assert.equal(result.json.id, 201);
});

test('DELETE returns 404 for a missing record', async () => {
  const result = await request('DELETE', '/99999');
  assert.equal(result.status, 404);
});

test('DELETE removes a record and returns 200', async () => {
  const result = await request('DELETE', '/204');
  assert.equal(result.status, 200);
  assert.match(result.json.message, /deleted/i);
  const check = await request('GET', '/204');
  assert.equal(check.status, 404);
});

test('Duplicate roll number is rejected', async () => {
  const result = await request('POST', '', {
    rollNumber: 'CSE2401', name: 'Another Student', branch: 'CSE', semester: 3, email: 'other@example.com'
  });
  assert.equal(result.status, 400);
});
