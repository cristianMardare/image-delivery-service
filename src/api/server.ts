import 'module-alias/register'

import express from 'express'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import yamljs from 'yamljs'

import { AppRouter } from './routes'
import cacheStats from './middleware/cache-stats'

const apiDocumentation = yamljs.load(path.join(__dirname, 'api-description.yaml'))
const app = express()

app.use(cacheStats)
app.use(AppRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

export const server: express.Express = app