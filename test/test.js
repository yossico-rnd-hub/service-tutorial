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

// function test_callback() {
//     redisLocker.lock(resourceId, ttl, function (err, result) {
//         if (err) {
//             console.log('error: ' + err);
//         }
//         else {
//             let token = result;
//             console.log('locked: ' + token);

//             redisLocker.unlock(resourceId, token, function (err, result) {
//                 if (0 == result)
//                     console.log('unlocked failed! ' + token)
//                 else
//                     console.log('unlocked succeeded: ' + token)
//             });

//             redisLocker.unlock(resourceId, token, function (err, result) {
//                 if (0 == result)
//                     console.log('unlock again failed! ' + token)
//                 else
//                     console.log('unlock again succeeded: ' + token)
//             });

//             redisLocker.unlock(resourceId, 'fake-token', function (err, result) {
//                 token = result;
//                 if (0 == result)
//                     console.log('unlocked fake-token failed!')
//                 else
//                     console.log('unlocked fake-token succeeded.')
//             });
//         }
//     });
// }

// test_async_await();
test_promise();
// test_callback();
