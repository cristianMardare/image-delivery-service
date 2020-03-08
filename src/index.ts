import path from 'path'
import { server }  from './api/server'
import { Stats } from '@services/Stats'

global.__basedir = path.join(__dirname, '..')

const PORT = 62226

Stats.getInstance().watch(path.join(global.__basedir, 'repository'), 'repository_count')

server.listen(PORT, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server listening at http://localhost:${PORT}`);
	});

