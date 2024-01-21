const _ = require('lodash');



exports.fn = (fn, cache, keyFn) => {
  return async (...args) => {
    let key = keyFn(...args);
    let ret = cache.get(key);
    if(!ret) {
      ret = await fn(...args);
      cache.put(key, ret);
    }
    return ret;
  }
}

exports.fnSync = (fn, cache, keyFn) => {
  return (...args) => {
    let key = keyFn(...args);
    let ret = cache.get(key);
    if(!ret) {
      ret = fn(...args);
      cache.put(key, ret);
    }
    return ret;
  }
}



exports.ttl = function(ttl = 5 * 60, clone = true) {

  const map = {};
  ttl = Math.max(ttl, 60);
  let timestamp = Date.now();

  this.get = (key) => {

    let obj = map[key];
    if(obj === undefined)
      return undefined;

    if(obj.expiry < Date.now())
      return undefined;

    let val = obj.value;

    if(clone && val !== null && typeof val == 'object')
      return _.cloneDeep(val);

    return val;

  };

  this.put = (key, val) => {

    if(val === undefined)
      return;

    if(clone && val !== null && typeof val == 'object')
      val = _.cloneDeep(val);

    map[key] = {
      value: val,
      expiry: Date.now() + ttl * 1000
    };

    if(timestamp + 60 * 1000 < Date.now()) {
      timestamp = Date.now();
      for(let key in map)
        if(map[key].expiry < Date.now())
          delete map[key];
    }

  };

  this.delete = (key) => {
    delete map[key];
  };

}

exports.lru = function(size = 1024, clone = true) {

  let map = {};
  size = Math.max(size, 2);

  this.get = (key) => {

    let obj = map[key];
    if(obj === undefined)
      return undefined;

    obj.timestamp = Date.now();

    let val = obj.value;

    if(clone && val !== null && typeof val == 'object')
      return _.cloneDeep(val);

    return val;

  };

  this.put = (key, val) => {

    if(val === undefined)
      return;

    if(clone && val !== null && typeof val == 'object')
      val = _.cloneDeep(val);

    map[key] = {
      value: val,
      timestamp: Date.now()
    };

    let entries = Object.entries(map);
    if(entries.length > size) {
      let lruEntry = _.minBy(entries, entry => entry[1].timestamp);
      delete map[lruEntry[0]];
    }

  };

  this.delete = (key) => {
    delete map[key];
  };

}
