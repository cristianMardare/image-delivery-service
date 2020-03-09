import path from 'path'

export function pathFromRoot(...folders): string {
	const root = global.__basedir

	folders = normalize(...folders)
	if (typeof (folders) === 'undefined')
		return path.join(root)


	let output = path.join(root, ...folders)

	return output
}		
	

function normalize(...input: any[]) {
	if (!input || input.length === 0)
		return undefined

	return input.reduce((output, element) => {
		if (typeof (element) === 'undefined' || element === null)
			return output			// skip undefined / null elements

		if (typeof (element) === 'string')
		{
			output.push(element)
			return output	
		} 

		if (typeof (element) === 'object'){
			if (element.length)	// element is an array, try to normalize it as well
			{
				output.push(...normalize(...element))
				return output
			}
			
			for (const key in element){
				output.push(...normalize(element[key]))
			}

			return output
		}

		output.push(element.toString())
		return output
	}, [])
}