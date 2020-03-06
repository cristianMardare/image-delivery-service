import 'module-alias/register';
import express from 'express'
import http from 'http'
import { AppRouter } from './routes'

export default function(): http.Server {
	const PORT = 62226

	const app = express()
	app.use(AppRouter)

	let server: http.Server = app.listen(PORT, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server listening at http://localhost:${PORT}`);
	});

	return server;
}
