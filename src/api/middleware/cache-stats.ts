import { Request, Response } from 'express'
import onHeaders from 'on-headers'
import { Stats } from '@services/Stats'

export default function(req :Request, res: Response, next: Function) {
	//NOTE: Execute a listener when a response is about to write headers. (https://www.npmjs.com/package/on-headers)
	onHeaders(res, computeCacheStats)
	
	next()
}

function computeCacheStats() {
	// this: express.Response
	const value = this.getHeader('x-cache')
	
	let stats = Stats.getInstance()

	switch(value){
		case 'HIT': 
			stats.cacheHit()
			break
		case 'MISS': 
			stats.cacheMiss()
			break	
	}

}