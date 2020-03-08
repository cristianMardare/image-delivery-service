import { Request, Response } from 'express'

import { Stats } from '@services/Stats'

export default class StatisticsController {
	get = async (req: Request, res: Response) => { 
		const stats = Stats.getInstance().get()
		return res.send(stats)
	}

}