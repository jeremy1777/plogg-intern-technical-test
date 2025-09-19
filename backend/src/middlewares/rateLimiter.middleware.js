const IORedis = require('ioredis');

const redisClient = new IORedis();

const WINDOW_DURATION_IN_SECONDS = 300; // 5 minutes
const MAX_REQUESTS = 3;

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const { email } = req.body;

    if (!email) {
      return next();
    }

    const ipKey = `rate-limit:ip:${ip}`;
    const emailKey = `rate-limit:email:${email.toLowerCase()}`;

    const multi = redisClient.multi();
    multi.incr(ipKey);
    multi.incr(emailKey);
    
    const replies = await multi.exec();

    const ipRequests = replies[0][1];
    const emailRequests = replies[1][1];

    if (ipRequests === 1) {
      await redisClient.expire(ipKey, WINDOW_DURATION_IN_SECONDS);
    }
    if (emailRequests === 1) {
      await redisClient.expire(emailKey, WINDOW_DURATION_IN_SECONDS);
    }
    
    if (ipRequests > MAX_REQUESTS || emailRequests > MAX_REQUESTS) {
      return res.status(429).json({ 
        message: 'You have sent too many requests from this IP or email. Please try again in 5 minutes.' 
      });
    }

    next();

  } catch (error) {
    console.error('Error in Rate Limiter:', error);
    next();
  }
};

module.exports = rateLimiter;