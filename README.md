# service-tutorial

node.js tutorial - writing a (gg) service from scratch

## locks service - software requirements

The locks service has the following behavior:
Given a string resource identifier (and user id?):

1. lock the resource (fails if alreay locked, support lock expiration/TTL)
2. renew resource lock (reset TTL)
3. unlock a resource
4. register/unregister requests for unlock notifications

### properties

1. Safety property: Mutual exclusion. At any given moment, only one client can hold a lock.
2. Liveness property: Deadlock free. Eventually it is always possible to acquire a lock, even if the client that locked a resource crashes or gets partitioned.
