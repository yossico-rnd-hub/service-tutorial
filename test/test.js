var Redis = require("ioredis");
var redis = new Redis(6379, "127.0.0.1");

var resourceId = 'foo';
var ttl = 10;

redis.defineCommand('lock', {
    numberOfKeys: 1, 
    lua:   `local function get_token()
                local token = string.random(3)
                if 0 == redis.call("exists", token) then
                    return token
                end
                return get_token()
            end
            local token = get_token()
            local token = 'foo'
            redis.call("set", "${resourceId}", token, "NX")
            redis.call("expire", "${resourceId}", ${ttl})`
});

redis.lock('lilo', 10)

