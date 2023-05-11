import request from 'supertest';
import { app } from '../server';
import { startServer, stopServer } from '../server';
import { config } from '../config';
import { StatusCodes } from 'http-status-codes';

import {
  getValidUserAndToken,
  getExistingJokeId,
  getNotExistingJokeId,
  getUserJokeId,
  getNotUserJokeId,
  getJokeExampleBody,
  getRateExampleBody,
  getCommentExampleBody,
} from './utils';

beforeAll(async () => {
  const databaseConfig = {
    dropDb: true,
    seedDb: true,
  };

  await startServer(config.server, databaseConfig);
});

/* -------------------------------- JOKES ENDPOINTS ------------------------------- */

/* -------------------------------- GET ALL JOKES --------------------------------- */
describe('[JOKES ENDPOINTS] GET ALL JOKES [/jokes] - success', () => {
  it('Test should successfully return all jokes', async () => {
    const res = await request(app).get('/jokes');
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// /* --------------------------------- GET RANDOM JOKE ------------------------------- */
describe('[JOKES ENDPOINTS] GET RANDOM JOKE [/jokes/random] - success', () => {
  it('Test should successfully return random joke', async () => {
    const res = await request(app).get('/jokes/random');
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
  });
});

/* -------------------------------- GET SPECIFIC JOKE ------------------------------- */
describe('[JOKES ENDPOINTS] GET SPECIFIC JOKE [/jokes/specific/:id] - success', () => {
  it('Test should succesfully return specific joke', async () => {
    const jokeId = await getExistingJokeId();
    const res = await request(app).get(`/jokes/specific/${jokeId}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
  });
});

describe('[JOKES ENDPOINTS] GET SPECIFIC JOKE [/jokes/specific/:id] - not found', () => {
  it('Test should fail, because of not existing ID', async () => {
    const nonExistingId = await getNotExistingJokeId();
    const res = await request(app).get(`/jokes/specific/${nonExistingId}`);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('[JOKES ENDPOINTS] GET SPECIFIC JOKE [/jokes/specific/:id] - invalid params schema', () => {
  it('Test should fail, becouse of invalid params schema', async () => {
    const invalidParamId = 'invalidId';
    const res = await request(app).get(`/jokes/specific/${invalidParamId}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});
/* ------------------------------------- ADD JOKE ------------------------------------ */

describe('[JOKES ENDPOINTS] ADD JOKE [/jokes/add] - success', () => {
  it('Test should succesfully add joke', async () => {
    const { token } = await getValidUserAndToken();
    const payload = await getJokeExampleBody();
    const res = await request(app).post('/jokes/add').set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
  });
});

describe('[JOKES ENDPOINTS] ADD JOKE [/jokes/add] - unauthorized', () => {
  it('Test should fail, because of unauthorized user', async () => {
    const invalidToken = 'invalid-token';
    const payload = await getJokeExampleBody();
    const res = await request(app).post('/jokes/add').set('Authorization', invalidToken).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('[JOKES ENDPOINTS] ADD JOKE [/jokes/add] - invalid body schema', () => {
  it('Test should fail, becouse of invalid body schema', async () => {
    const { token } = await getValidUserAndToken();
    const payload = await getJokeExampleBody(false);
    const res = await request(app).post('/jokes/add').set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});
/* -------------------------------- UPDATE SPECIFIC JOKE ------------------------------- */
describe('[JOKES ENDPOINTS] UPDATE SPECIFIC JOKE [/jokes/specific/:id] - success', () => {
  it('Test should succesfully update specific joke', async () => {
    const { user, token } = await getValidUserAndToken();
    const payload = await getJokeExampleBody();
    const jokeId = await getUserJokeId(user.id);
    const res = await request(app).patch(`/jokes/specific/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});

describe('[JOKES ENDPOINTS] UPDATE SPECIFIC JOKE [/jokes/specific/:id] - not found', () => {
  it('Test should fail, because of not found joke', async () => {
    const { token } = await getValidUserAndToken();
    const payload = await getJokeExampleBody();
    const jokeId = await getNotExistingJokeId();
    const res = await request(app).patch(`/jokes/specific/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('[JOKES ENDPOINTS] UPDATE SPECIFIC JOKE [/jokes/specific/:id] - no permissions', () => {
  it('Test should fail, because of no permission', async () => {
    const { user, token } = await getValidUserAndToken();
    const payload = await getJokeExampleBody();
    const jokeId = await getNotUserJokeId(user.id);
    const res = await request(app).patch(`/jokes/specific/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });
});

describe('[JOKES ENDPOINTS] UPDATE SPECIFIC JOKE [/jokes/specific/:id] - unauthorized', () => {
  it('Test should fail, because of unauthorized user', async () => {
    const invalidToken = 'invalid-token';
    const { user } = await getValidUserAndToken();
    const payload = await getJokeExampleBody();
    const jokeId = await getNotUserJokeId(user.id);
    const res = await request(app).patch(`/jokes/specific/${jokeId}`).set('Authorization', invalidToken).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('[JOKES ENDPOINTS] UPDATE SPECIFIC JOKE [/jokes/specific/:id] - invalid params schema', () => {
  it('Test should fail, becouse of invalid body schema', async () => {
    const { user, token } = await getValidUserAndToken();
    const payload = await getJokeExampleBody(false);
    const jokeId = await getUserJokeId(user.id);
    const res = await request(app).patch(`/jokes/specific/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

/* ------------------------------------- RATE JOKE ----------------------------------- */
describe('[JOKES ENDPOINTS] RATE JOKE [/jokes/rate/:id] - success', () => {
  it('Test should succesfully rate joke', async () => {
    const payload = await getRateExampleBody();
    const { user, token } = await getValidUserAndToken();
    const jokeId = await getNotUserJokeId(user.id);
    const res = await request(app).post(`/jokes/rate/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
  });
});

describe('[JOKES ENDPOINTS] RATE JOKE [/jokes/rate/:id] - not found', () => {
  it('Test should fail, because of not found joke', async () => {
    const payload = await getRateExampleBody();
    const { token } = await getValidUserAndToken();
    const jokeId = await getNotExistingJokeId();
    const res = await request(app).post(`/jokes/rate/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('[JOKES ENDPOINTS] RATE JOKE [/jokes/rate/:id] - no permissions', () => {
  it('Test should fail, because of no permissions of rating own joke', async () => {
    const payload = await getRateExampleBody();
    const { user, token } = await getValidUserAndToken();
    const jokeId = await getUserJokeId(user.id);
    const res = await request(app).post(`/jokes/rate/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });
});

describe('[JOKES ENDPOINTS] RATE JOKE [/jokes/rate/:id] - unauthorized', () => {
  it('Test should fail, because of unauthorized user', async () => {
    const payload = await getRateExampleBody();
    const invalidToken = 'invalid-token';
    const { user } = await getValidUserAndToken();
    const jokeId = await getUserJokeId(user.id);
    const res = await request(app).post(`/jokes/rate/${jokeId}`).set('Authorization', invalidToken).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('[JOKES ENDPOINTS] RATE JOKE [/jokes/rate/:id] - invalid body schema', () => {
  it('Test should succesfully rate joke', async () => {
    const payload = await getRateExampleBody(false);
    const { user, token } = await getValidUserAndToken();
    const jokeId = await getNotUserJokeId(user.id);
    const res = await request(app).post(`/jokes/rate/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('[JOKES ENDPOINTS] RATE JOKE [/jokes/rate/:id] - invalid params schema', () => {
  it('Test should succesfully rate joke', async () => {
    const payload = await getRateExampleBody();
    const { token } = await getValidUserAndToken();
    const jokeId = 'invalid-joke-id';
    const res = await request(app).post(`/jokes/rate/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

/* ----------------------------------- COMMENT JOKE --------------------------------- */
describe('[JOKES ENDPOINTS] COMMENT JOKE [/jokes/comment/:id] - success', () => {
  it('Test should succesfully comment joke', async () => {
    const payload = await getCommentExampleBody();
    const { token } = await getValidUserAndToken();
    const jokeId = await getExistingJokeId();
    const res = await request(app).post(`/jokes/comment/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
  });
});

describe('[JOKES ENDPOINTS] COMMENT JOKE [/jokes/comment/:id] - not found', () => {
  it('Test should fail, because of not found joke', async () => {
    const payload = await getCommentExampleBody();
    const { token } = await getValidUserAndToken();
    const jokeId = await getNotExistingJokeId();
    const res = await request(app).post(`/jokes/comment/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('[JOKES ENDPOINTS] COMMENT JOKE [/jokes/comment/:id] - unauthorized', () => {
  it('Test should fail, because of unauthorized user', async () => {
    const payload = await getCommentExampleBody();
    const invalidToken = 'invalid-token';
    const jokeId = await getExistingJokeId();
    const res = await request(app).post(`/jokes/comment/${jokeId}`).set('Authorization', invalidToken).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('[JOKES ENDPOINTS] COMMENT JOKE [/jokes/comment/:id] - invalid body schema', () => {
  it('Test should succesfully comment joke', async () => {
    const payload = await getCommentExampleBody(false);
    const { token } = await getValidUserAndToken();
    const jokeId = await getExistingJokeId();
    const res = await request(app).post(`/jokes/comment/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('[JOKES ENDPOINTS] COMMENT JOKE [/jokes/comment/:id] - invalid params schema', () => {
  it('Test should succesfully comment joke', async () => {
    const payload = await getCommentExampleBody();
    const { token } = await getValidUserAndToken();
    const jokeId = 'invalid-joke-id';
    const res = await request(app).post(`/jokes/comment/${jokeId}`).set('Authorization', token).send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

/* ------------------------------- DELETE SPECIFIC JOKE ------------------------------ */
describe('[JOKES ENDPOINTS] DELETE SPECIFIC JOKE [/jokes/specific/:id] - success', () => {
  it('Test should succesfully delete specific joke', async () => {
    const { user, token } = await getValidUserAndToken();
    const jokeId = await getUserJokeId(user.id);
    const res = await request(app).delete(`/jokes/specific/${jokeId}`).set('Authorization', token);
    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});

describe('[JOKES ENDPOINTS] DELETE SPECIFIC JOKE [/jokes/specific/:id] - not found', () => {
  it('Test should fail, because of not found joke', async () => {
    const { token } = await getValidUserAndToken();
    const jokeId = await getNotExistingJokeId();
    const res = await request(app).delete(`/jokes/specific/${jokeId}`).set('Authorization', token);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('[JOKES ENDPOINTS] DELETE SPECIFIC JOKE [/jokes/specific/:id] - no permissions', () => {
  it('Test should fail, because of no permission', async () => {
    const { user, token } = await getValidUserAndToken();
    const jokeId = await getNotUserJokeId(user.id);
    const res = await request(app).delete(`/jokes/specific/${jokeId}`).set('Authorization', token);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });
});

describe('[JOKES ENDPOINTS] DELETE SPECIFIC JOKE [/jokes/specific/:id] - unauthorized', () => {
  it('Test should fail, because of unauthorized user', async () => {
    const invalidToken = 'invalid-token';
    const res = await request(app).delete('/jokes/specific/1').set('Authorization', invalidToken);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('[JOKES ENDPOINTS] DELETE SPECIFIC JOKE [/jokes/specific/:id] - invalid params schema', () => {
  it('Test should fail, because of invalid params schema', async () => {
    const { token } = await getValidUserAndToken();
    const jokeId = 'invalid-id';
    const res = await request(app).delete(`/jokes/specific/${jokeId}`).set('Authorization', token);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

afterAll(async () => {
  await stopServer();
  setTimeout(() => process.exit(), 1000);
});
