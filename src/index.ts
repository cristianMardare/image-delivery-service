import path from 'path'
import server from './api/server'

global.__basedir = path.join(__dirname, '..')
console.log(global.__basedir)

server()	// start server