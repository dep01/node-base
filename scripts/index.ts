import {
  genToday,
} from "../helpers/global";

class CronIndex {
  async initialized() {
    try {
      console.log(`CRON RUNNING ON ${genToday(true)}`);
    } catch (error) {
      console.log(error);
    }
  }
}

export default CronIndex;

const c = new CronIndex();