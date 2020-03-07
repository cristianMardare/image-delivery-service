import 'module-alias/register';
import express from 'express'
import http from 'http'
import { AppRouter } from './routes'


const app = express()

app.use(AppRouter)

export const server: express.Express = app