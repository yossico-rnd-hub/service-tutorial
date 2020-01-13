let assert = require("chai").assert;
let mocha = require("mocha");
let container = require("./testingContainerConfig").container;
let configureContainer = require("./testingContainerConfig").configureContainer;
let resetContainer = require("./testingContainerConfig").resetContainer;

describe('Check locker functionality', async ()=>{

    beforeEach(()=>{

        resetContainer();

        configureContainer();

    });


    it('Locker.isLocked - Should return false on non-locked resource', async ()=>{

        try{
            let locker = container.get('locker');
            let isLocked = await locker.isLocked("someUnknownReource");
            
            assert.isNotTrue(isLocked, `Expected ${false} but got ${isLocked}`);
        }catch(error){
            assert.fail(error, "", "Error was raised." + error);
        }

    });


    it('Locker.isLocked - Should return true on locked resource', async()=>{
        try{
            let locker = container.get('locker');
            await locker.lock("someReource", 100);
            let isLocked = await locker.isLocked("someReource");
            
            assert.isNotFalse(isLocked, `Expected ${true} but got ${isLocked}`);
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });

    it('Locker.isLocked - Should fail checking resource with undefined resourceId', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.isLocked(undefined);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.isLocked - Should fail checking resource with resourceId of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.isLocked({});

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });










    it('Locker.lock - Should success locking resource', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("someReource", 100);
            
            assert.isString(token, `Expected a string token but got ${token}`);

        }catch(error){
            assert.fail(error, "", "Error was raised." + error);
        }
    });

    it('Locker.lock - Should fail locking resource with undefined ttl', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("someReource", undefined);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.lock - Should fail locking resource with undefined resource', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock(undefined, 100);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.lock - Should fail locking resource with ttl of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("resource", "shouldBeNumber");

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.lock - Should fail locking resource with resourceId of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock({}, "shouldBeNumber");

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });


    



    it('Locker.unlock - Should fail unlocking resource with undefined token', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.unlock("someReource", undefined);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.unlock - Should fail unlocking resource with undefined resourceId', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.unlock(undefined, "token");

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.unlock - Should fail unlocking resource with token of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.unlock("resource", {});

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.unlock - Should fail unlocking resource with resourceId of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.unlock({}, "blabal");

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.unlock - Should not succeed unlocking non-locked resource', async()=>{
        try{
            let locker = container.get('locker');
            let success = await locker.unlock("someNonLockedResource", "blabal");

            assert.isNotTrue(success, `Should fail unlocking non locked resource. Response: ${success}`);
            
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });

    it('Locker.unlock - Should not succeed unlocking a resource with different token', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("someResource", 10000);
            let success = await locker.unlock("someResource", "This Is Not The Token");

            assert.isNotTrue(success, `Should fail unlocking resource with different token. Response: ${success}. Expected Token: ${token}`);
            
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });

    it('Locker.unlock - Should unlock succeessfuly', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("someResource", 10000);
            let success = await locker.unlock("someResource", token);

            assert.isNotTrue(success, `Unlock should have been successful`);
            
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });


    



    it('Locker.renewLockLease - Should fail to renew resource with undefined token', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.renewLockLease("someReource", undefined, 1000);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.renewLockLease - Should fail to renew resource with undefined resourceId', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.renewLockLease(undefined, "token", 1000);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.renewLockLease - Should fail to renew resource with undefined ttl', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.renewLockLease("token", "token", undefined);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.renewLockLease - Should fail to renew resource with token of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.renewLockLease("resource", {}, 100);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.renewLockLease - Should fail to renew resource with resourceId of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.renewLockLease({}, "blabal", 1000);

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.renewLockLease - Should fail to renew resource with ttl of incorect type', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.renewLockLease("blas", "blabal", "sdfdf");

            assert.fail(token, typeof TypeError, "Provided invalid arguments, but operation succeeded");
            
        }catch(error){
            assert.instanceOf(error, TypeError);
        }
    });

    it('Locker.renewLockLease - Should not succeed to renew non-locked resource', async()=>{
        try{
            let locker = container.get('locker');
            let success = await locker.renewLockLease("someNonLockedResource", "blabal", 1000);

            assert.isNotFalse(success, `Should fail to renew non locked resource. Response: ${success}`);
            
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });

    it('Locker.renewLockLease - Should not succeed to renew a resource with different token', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("someResource", 10000);
            let success = await locker.renewLockLease("someResource", "This Is Not The Token",100000);

            assert.isNotFalse(success, `Should fail to renew resource with different token. Response: ${success}. Expected Token: ${token}`);
            
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });

    it('Locker.renewLockLease - Should renew succeessfuly', async()=>{
        try{
            let locker = container.get('locker');
            let token = await locker.lock("someResource", 10000);
            let success = await locker.renewLockLease("someResource", token, 100000);

            assert.isNotFalse(success, `renewLockLease should have been successful`);
            
        }catch(error){
            assert.fail(error, "", "Error was raised.");
        }
    });
});