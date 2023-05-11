import request from 'supertest';
import { app } from '../server';
import { startServer, stopServer } from '../server';
import { config } from '../config';
import { StatusCodes } from 'http-status-codes';
import { getValidUserAndToken } from './utils';

beforeAll(async () => {
  const databaseConfig = {
    dropDb: true,
    seedDb: true,
  };

  await startServer(config.server, databaseConfig);
});

describe('[AUTH ENDPOINTS] Get user [/login] - success', () => {
  it('Test should successfully return logged user data', async () => {
    const { token } = await getValidUserAndToken();

    const res = await request(app).get('/users/me').set('Authorization', token);
    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});

describe('[AUTH ENDPOINTS] Get user [/login] - invalid token', () => {
  it('Test should fail, because of invalid token', async () => {
    const token = 'invalid-token';

    const res = await request(app).get('/users/me').set('Authorization', token);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

afterAll(async () => {
  await stopServer();
  setTimeout(() => process.exit(), 1000);
});
