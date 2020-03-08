import { Request, Response } from 'express'

import { StatisticsService } from '@services/statistics'

export default class StatisticsController {
	get = async (req: Request, res: Response) => { 
		const stats = StatisticsService.getInstance().get()
		return res.send(stats)
	}

}