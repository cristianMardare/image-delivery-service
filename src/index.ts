import path from 'path'
import { server }  from './api/server'
import { StatisticsService } from '@services/statistics'
import { pathFromRoot } from '@services/utils'

global.__basedir = path.join(__dirname, '..')

const PORT = 62226

StatisticsService.getInstance().watch(pathFromRoot('repository'), 'original_file_count')
StatisticsService.getInstance().watch(pathFromRoot('cache'), 'resized_file_count')

server.listen(PORT, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server listening at http://localhost:${PORT}`);
	});

