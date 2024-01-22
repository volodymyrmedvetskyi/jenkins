// tests/calculator.test.ts
import request from 'supertest';
import app from '../src/index';

describe('Calculator API', () => {
  it('GET /calculator should return the calculator page', async () => {
    const response = await request(app).get('/calculator');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('TypeScript Calculator');
  });

  it('POST /calculate for addition', async () => {
    const response = await request(app)
      .post('/calculate')
      .type('form')
      .send({ a: '5', b: '3', operation: 'add' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain('result=8');
  });

  it('POST /calculate for subtraction', async () => {
    const response = await request(app)
      .post('/calculate')
      .type('form')
      .send({ a: '5', b: '3', operation: 'subtract' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain('result=2');
  });

  it('POST /calculate for multiplication', async () => {
    const response = await request(app)
      .post('/calculate')
      .type('form')
      .send({ a: '5', b: '3', operation: 'multiply' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain('result=15');
  });

  it('POST /calculate for division', async () => {
    const response = await request(app)
      .post('/calculate')
      .type('form')
      .send({ a: '6', b: '3', operation: 'divide' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain('result=2');
  });
});
