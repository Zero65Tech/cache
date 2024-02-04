# Cache Utils 

This repository provides a set of utility functions for implementing caching mechanisms, including Time-To-Live (TTL) and Least Recently Used (LRU) caches. These utilities can be useful for optimizing the performance of functions by caching their results and minimizing redundant computations.

## Installation

```bash
npm install
```

## Usage

### TTL Cache

The TTL cache implements a simple key-value store with a time-to-live mechanism. The stored values are automatically evicted after a specified duration.

```javascript
const { ttl } = require('cache-utils');

const cache = new ttl(60); // Set TTL to 60 seconds

cache.put('key', 'value');
const result = cache.get('key');
console.log(result); // Output: 'value'
```

### LRU Cache

The LRU cache implements a least recently used algorithm to evict the least recently accessed items when the cache size exceeds a specified limit.

```javascript
const { lru } = require('cache-utils');

const cache = new lru(2); // Set cache size to 2

cache.put('key1', 'value1');
cache.put('key2', 'value2');
cache.put('key3', 'value3'); // Evicts 'key1' due to size limit

console.log(cache.get('key1')); // Output: undefined
console.log(cache.get('key2')); // Output: 'value2'
console.log(cache.get('key3')); // Output: 'value3'
```

### Function Caching

The repository also provides utility functions for caching the results of asynchronous and synchronous functions.

#### Asynchronous Function Caching

```javascript
const { fn, ttl } = require('cache-utils');
const cache = new ttl();

const asyncFunction = async (param) => {
  // ... some asynchronous computation
  return result;
};

const cachedAsyncFunction = fn(asyncFunction, cache, (param) => param);

const result = await cachedAsyncFunction('someParam');
```

#### Synchronous Function Caching

```javascript
const { fnSync, lru } = require('cache-utils');
const cache = new lru();

const syncFunction = (param) => {
  // ... some synchronous computation
  return result;
};

const cachedSyncFunction = fnSync(syncFunction, cache, (param) => param);

const result = cachedSyncFunction('someParam');
```

## Tests

The repository includes Jest test cases to ensure the correctness and functionality of the provided cache utilities. You can run the tests using the following command:

```bash
npm test
```
