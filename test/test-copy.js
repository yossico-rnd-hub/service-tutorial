// https://www.npmjs.com/package/ioredis-mock

var Redis = require("ioredis");

redis = new Redis({
    port: 6379,
    host: 'localhost'
});

// Define a lock command using Lua script
redis.defineCommand('lock', {
    numberOfKeys: 1,
    lua: `-- function to generate a random uuid
            local function uuid()
                local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                return string.gsub(template, '[xy]', function (c)
                    local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
                    return string.format('%x', v)
                end)
            end

            -- function to generate a token
            -- retry while token alredy exists
            local function get_token()
                local token = uuid()
                if 0 == redis.call("exists", token) then
                    return token
                end
                return get_token()
            end
            
            -- generate a token
            local token = get_token()

            -- set key if value (token) not exists
            redis.call("set", KEYS[1], token, "NX")
            
            -- set ttl
            redis.call("expire", KEYS[1], ARGV[1])

            -- return token
            return token`
});

// Define a unlock command using Lua script
redis.defineCommand('unlock', {
    numberOfKeys: 1,
    lua: `-- delete the resource only if exists and it's avlue matches token.
            if redis.call("get", KEYS[1]) == ARGV[1]
            then
                return redis.call("del", KEYS[1])
            else
                return 0
            end`
});

var resourceId = 'lilo';
var ttl = 10;

usePromise = true;
if (usePromise) {
    redis.lock(resourceId, ttl)
        .then((token) => console.log('locked: ' + token))
        .then((token) => { return redis.unlock(resourceId, token) })
        .then((res) => { console.log('unlocked success.') })
        .then(() => { return redis.unlock(resourceId, token) })
        .catch((res) => { console.log('unlocked again failure!'); resolve(); })
        .then(() => { return redis.unlock(resourceId, 'fake-token') })
        .catch((res) => { console.log('unlocked fake-token failure!'); })
}
else {
    redis.lock(resourceId, ttl, function (err, result) {
        if (err) {
            console.log('error: ' + err);
        }
        else {
            let token = result;
            console.log('locked: ' + token);

            redis.unlock(resourceId, token, function (err, result) {
                if (0 == result)
                    console.log('unlocked failed! ' + token)
                else
                    console.log('unlocked succeeded: ' + token)
            });

            redis.unlock(resourceId, token, function (err, result) {
                if (0 == result)
                    console.log('unlock again failed! ' + token)
                else
                    console.log('unlock again succeeded: ' + token)
            });

            redis.unlock(resourceId, 'fake-token', function (err, result) {
                token = result;
                if (0 == result)
                    console.log('unlocked fake-token failed!')
                else
                    console.log('unlocked fake-token succeeded.')
            });
        }
    });
}
