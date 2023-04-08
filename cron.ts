const cron = require('node-cron');
import CronJob from "./scripts/index"

const task = cron.schedule("*/1 * * * *",()=>{
	const cron_task = new CronJob();
	cron_task.initialized();
});

console.log('agent starto');
task.start();