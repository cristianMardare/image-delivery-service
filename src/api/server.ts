import 'module-alias/register';
import express from 'express'

import { AppRouter } from './routes'
import cacheStats from './middleware/cache-stats'

const app = express()

app.use(cacheStats)
app.use(AppRouter)

export const server: express.Express = app