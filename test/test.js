'use strict';

var Redis = require("ioredis");

var RedisLocker = require("../services/redisLocker")

var redisLocker = new RedisLocker({
    port: 6379,
    host: 'localhost'
});

async function test() {
    var resourceId = 'lilo';
    var ttl = 10;

    try {
        let token = await redisLocker.lock(resourceId, ttl);
        console.log('lock success: ' + token);
        await redisLocker.unlock(resourceId, token);
        console.log('unlock success: ' + token);
        console.log('trying to unlock again...');
        var res = await redisLocker.unlock(resourceId, token);
        console.log(res);
    }
    catch (e) {
        console.log('ERROR! ');
    }

    console.log('done.')
}

test();
