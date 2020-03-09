import fs from 'fs'
import path from 'path'
import util from 'util'

const stat = util.promisify(fs.stat)

export class ImageLocator {
	private _location: string

	constructor(location: string){
		this._location = location
	}

	read = (file:string) : fs.ReadStream | undefined => {
		let pathToFile: string = this._buildPath(file)

		return fs.createReadStream(pathToFile)
	}

	write = (file: string) : fs.WriteStream => {
		let pathToFile: string = this._buildPath(file)
		
		return fs.createWriteStream(pathToFile)
	}

	exists = async(file:string) : Promise<boolean> => {

		try{
			let pathToFile: string = this._buildPath(file)
			let stats = await stat(pathToFile)

			return true
		}
		catch (err){
			return false
		}


	}

	private _buildPath = (file:string): string => {
		return path.join(this._location, file)
	}
}