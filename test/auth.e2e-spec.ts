import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const email = 'test@test.com',
  password = '12345';
describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.email).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body.email).toEqual(email);
        expect(res.body.id).toBeDefined();
      });
  });

  it('signup as a new user then signout correctly', async () => {
    let res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    let cookie = res.get('Set-Cookie');

    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body.email).toEqual(email);
        expect(res.body.id).toBeDefined();
      });

    res = await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Cookie', cookie)
      .expect(201);

    cookie = res.get('Set-Cookie');

    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body.email).toBeUndefined();
        expect(res.body.id).toBeUndefined();
      });
  });
});
