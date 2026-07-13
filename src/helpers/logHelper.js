import 'dotenv/config' 
import fs from 'fs';

class LogHelper {
    constructor() {
        this.filePath = process.env.LOG_FILE_PATH;
        this.fileName = process.env.LOG_FILE_NAME;
        this.logToFileEnabled = (process.env.LOG_TO_FILE_ENABLED || 'false').toLowerCase() === 'true';
        this.logToConsoleEnabled = (process.env.LOG_TO_CONSOLE_ENABLED || 'true').toLowerCase() === 'true';
    }
    /**
     * * Este método almacena en un archivo de texto y/o por muestra consola información del Error.
     * * @param {*} errorObject
     * */
    
    getRoute = () => {
        return this.filePath + this.fileName
    }

    logError = (errorObject) => {
        console.log(errorObject)
        fs.writeFile(this.getRoute, errorObject, (err) => {
            if (err) throw err
        })
    }
}

export default new LogHelper();