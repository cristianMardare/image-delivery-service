import path from 'path'
import { server }  from './api/server'

global.__basedir = path.join(__dirname, '..')

const PORT = 62226

server.listen(PORT, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server listening at http://localhost:${PORT}`);
	});

