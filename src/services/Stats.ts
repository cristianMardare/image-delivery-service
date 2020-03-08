import fs from 'fs'
import path from 'path'

export class Stats {
	private static instance: Stats

	static getInstance(): Stats{
		if (typeof (Stats.instance) === 'undefined')
			Stats.instance = new Stats()
			
		return Stats.instance
	}

	private _statistics: Statistics

	constructor(){
		this._statistics = {
			cache_hits: 0,
			cache_misses: 0
		}
	}

	cacheHit() {
		this._statistics.cache_hits++
	}

	cacheMiss() {
		this._statistics.cache_misses++
	}

	watch(folder: string, label: string){
		if (!folder)
			return

		if (!folder)
			label = path.basename(folder)

		try {
			// use sync API as watch method should be called on startup
			fs.statSync(folder)	
			this._statistics[label] = fs.readdirSync(folder).length
		}catch(err) {
			// folder does not exist so nothing to watch for
			return
		}

		fs.watch(folder, (event, filename) => {
			if (event === 'rename')	// On most platforms, 'rename' is emitted whenever a filename appears or disappears in the directory. (https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener)
			{
				fs.readdir(folder, (err, files) => {
					if (!err)
						this._statistics[label] = files.length
				})
			}
		})
	}

	get() {
		return this._statistics
	}
}

interface Statistics {
	cache_hits: number
	cache_misses: number
}