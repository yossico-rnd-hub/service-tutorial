'use strict';

var RedisLocker = require("../services/redisLocker");

var redisLocker = new RedisLocker({
    port: 6379,
    host: 'localhost'
});

async function test_lock_unlock(resourceId, ttl) {
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
}

async function test_is_locked(resourceId, ttl) {
    try {
        let token = await redisLocker.lock(resourceId, ttl);
        let locked = await redisLocker.isLocked(resourceId);
        console.log(locked ? `'${resourceId}' is locked!` : `'${resourceId}' is unlocked.`)

        await redisLocker.unlock(resourceId, token);
        locked = await redisLocker.isLocked(resourceId);
        console.log(locked ? `'${resourceId}' is locked!` : `'${resourceId}' is unlocked.`)
    }
    catch (e) {
        console.log('ERROR: ' + e);
    }
}

async function test_renewal(resourceId, ttl) {
    try {
        let token = await redisLocker.lock(resourceId, ttl);
        await redisLocker.renewLease(resourceId, token, ttl);
        console.log(`renew lease on '${resourceId}', ttl: ${ttl}`);
    }
    catch (e) {
        console.log('ERROR: ' + e);
    }
}

async function run_all_tests() {
    let resourceId = 'lilo';
    let ttl = 10;

    try {
        await test_lock_unlock(resourceId, ttl);
        await test_is_locked(resourceId, ttl);
        await test_renewal(resourceId, ttl);
    }
    finally {
        redisLocker.disconnect();
    }
}

run_all_tests();
