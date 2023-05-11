import request from 'supertest';
import { app } from '../server';
import { startServer, stopServer } from '../server';
import { config } from '../config';
import { StatusCodes } from 'http-status-codes';

beforeAll(async () => {
  const databaseConfig = {
    dropDb: true,
    seedDb: true,
  };

  await startServer(config.server, databaseConfig);
});

describe('[AUTH ENDPOINTS] Login [/login] - success', () => {
  it('Test should successfully login user', async () => {
    const payload = {
      body: {
        email: 'apodlipski@edu.cdv.pl',
        password: 'admin',
      },
    };
    const res = await request(app).post('/login').send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('token');
  });
});

describe('[AUTH ENDPOINTS] Login [/login] - invalid email or password', () => {
  it('Test should fail, because of invalid email or password', async () => {
    const payload = {
      body: {
        email: 'invalid@edu.cdv.pl',
        password: 'invalidpassword',
      },
    };
    const res = await request(app).post('/login').send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('[AUTH ENDPOINTS] Login [/login] - invalid body schema', () => {
  it('Test should fail, because of invalid body schema', async () => {
    const payload = {
      body: {
        emailXYZ: 'apodlipski@edu.cdv.pl',
        passwordXYZ: 'admin',
      },
    };
    const res = await request(app).post('/login').send(payload.body);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

afterAll(async () => {
  await stopServer();
  setTimeout(() => process.exit(), 1000);
});
