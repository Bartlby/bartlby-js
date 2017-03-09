import {debug} from 'debug'
const logger = debug("bartlby/Boss")

class Boss {
  constructor(workerCount) {
    logger("init")
    
  }
  
  work(data) {
    logger("handle:", data)
    return new Promise((resolve, reject) => {
      resolve(["aaa"])
    })
  }

}

export default Boss;