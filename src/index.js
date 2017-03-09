import { debug } from 'debug'

//Check Types
import v1 from "./connectors/legacy/v1"
import v2 from "./connectors/legacy/v2"

import Scheduler from "./scheduler"
import Boss from "./boss"

// Logging
const logger = debug("bartlby")

class Bartlby {
  constructor(config) {
    
  }
  start() {
    logger("Bartlby Init1")
    const boss = new Boss();
    const sched = new Scheduler(boss);
  }
}
export default Bartlby;