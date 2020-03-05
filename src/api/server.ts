import 'module-alias/register';
import express from 'express'
import { AppRouter } from './routes'


const PORT = 62226

const app = express()
app.use(AppRouter)

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${PORT}`);
});