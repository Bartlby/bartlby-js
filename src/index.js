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
    this.boss = new Boss();
    this.sched = new Scheduler(this.boss);
  }
}
export default Bartlby;