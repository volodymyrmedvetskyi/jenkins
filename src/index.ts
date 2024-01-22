// src/index.ts
import express, { Request, Response } from 'express';
import { Calculator } from './Calculator';

const app = express();
const port = 3000;
const calculator = new Calculator();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send(`
        <h2>Welcome to the TypeScript Calculator!</h2>
        <button onclick="window.location.href='/calculator'">Go to Calculator</button>
    `);
});

app.get('/calculator', (req: Request, res: Response) => {
  const result = req.query.result;
  res.send(`
        <h1>TypeScript Calculator</h1>
        <form action="/calculate" method="post">
            <input type="number" name="a" required /> <br/>
            <input type="number" name="b" required /> <br/>
            <select name="operation">
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
            </select> <br/>
            <button type="submit">Calculate</button>
        </form>
        ${result ? `<p>Result: ${result}</p>` : ''}
    `);
});

app.post('/calculate', (req: Request, res: Response) => {
  try {
    const a = parseFloat(req.body.a);
    const b = parseFloat(req.body.b);
    const operation = req.body.operation;

    let result: number;
    switch (operation) {
      case 'add':
        result = calculator.add(a, b);
        break;
      case 'subtract':
        result = calculator.subtract(a, b);
        break;
      case 'multiply':
        result = calculator.multiply(a, b);
        break;
      case 'divide':
        result = b !== 0 ? calculator.divide(a, b) : NaN;
        break;
      default:
        throw new Error('Invalid operation');
    }

    res.redirect(`/calculator?result=${result}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.redirect(`/calculator?result=${encodeURIComponent(error.message)}`);
    } else {
      res.redirect('/calculator?result=An%20unexpected%20error%20occurred');
    }
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
