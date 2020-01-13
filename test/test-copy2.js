'use strict';

var RedisLocker = require("../services/redisLocker");

async function test_lock_unlbhock(redisLocker, resourceId, ttl) {
    return new Promise(function (resolve, reject) {
        try {
            let token = await redisLocker.lock(resourceId, ttl);
            console.log('lock success: ' + token);

            let res = await redisLocker.unlock(resourceId, token);
            if (res)
                console.log('unlock success: ' + token);
            else
                console.log('ERROR: unlock failed: ' + token);

            console.log('trying to unlock again...');
            res = await redisLocker.unlock(resourceId, token);
            if (res)
                console.log('unlock again success.');
            else
                console.log('ERROR: unlock again failed!');

            console.log('trying to unlock with fake-token...');
            res = await redisLocker.unlock(resourceId, 'fake-token');
            if (res)
                console.log('unlock fake-token success.');
            else
                console.log('ERROR: unlock with a "fake-token" failed!');

            console.log('done.')
            resolve();
        }
        catch (e) {
            console.log('ERROR! ' + e);
            reject(e);
        }
    });
}

async function test_is_locked(redisLocker, resourceId) {
    let locked = await redisLocker.isLocked(resourceId);
    console.log(locked ? `'${resourceId}' is locked!` : `'${resourceId}' is not locked.`)
}

async function run_all_tests() {
    let redisLocker = new RedisLocker({
        port: 6379,
        host: 'localhost'
    });

    try {
        let resourceId = 'lilo';
        let ttl = 10;

        await test_lock_unlock(redisLocker, resourceId, ttl);
        await test_is_locked(redisLocker, resourceId);
    }
    finally {
        redisLocker.disconnect();
    }
}

await run_all_tests();
