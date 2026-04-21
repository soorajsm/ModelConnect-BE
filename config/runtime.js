export const isMemoryMode = String(process.env.USE_MEMORY_DB || '').toLowerCase() === 'true' || !process.env.MONGODB_URI;
