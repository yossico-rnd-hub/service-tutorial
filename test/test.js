'use strict';

var Redis = require("ioredis");

var RedisLocker = require("../services/redisLocker")

var redisLocker = new RedisLocker({
    port: 6379,
    host: 'localhost'
});

var resourceId = 'lilo';
var ttl = 10;

async function test_async_await() {
    try {
        let token = await redisLocker.lock(resourceId, ttl);
        console.log('lock success: ' + token);

        let res = await redisLocker.unlock(resourceId, token);
        if (res)
            console.log('unlock success: ' + token);
        else
            console.log('unlock failed: ' + token);

        console.log('trying to unlock again...');
        res = await redisLocker.unlock(resourceId, token);
        if (res)
            console.log('unlock again success.');
        else
            console.log('unlock again failed!');

        console.log('trying to unlock with fake-token...');
        res = await redisLocker.unlock(resourceId, 'fake-token');
        if (res)
            console.log('unlock fake-token success.');
        else
            console.log('unlock fake-token failed!');
    }
    catch (e) {
        console.log('ERROR! ' + e);
    }

    console.log('done.')
}

function test_promise() {
    redisLocker.lock(resourceId, ttl)
        .then((token) => { console.log('locked: ' + token) })
        .then((token) => { return redisLocker.unlock(resourceId, token) })
        .then((res) => { console.log('unlocked success.') })
        .then(() => { return redisLocker.unlock(resourceId, token) })
        .catch((res) => { console.log('unlocked again failure!'); resolve(); })
        .then(() => { return redisLocker.unlock(resourceId, 'fake-token') })
        .catch((res) => { console.log('unlocked fake-token failure!') })
}
test_async_await();
// test_promise();
