const cron = require('node-cron');

// Run cleanup every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled stock cleanup...');
    try {
        const result = await StockService.cleanupExpiredItems();
        console.log('Cleanup completed:', result);
    } catch (error) {
        console.error('Scheduled cleanup failed:', error);
    }
});
