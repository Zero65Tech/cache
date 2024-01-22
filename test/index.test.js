const { ttl, lru } = require('../src/index.js');


for(let [ name, ref ] of [[ 'TTL', ttl ], [ 'LRU', lru ]]) {
  describe(name, () => {

    test('.get() with non-existent key', () => {
      const cache = new ref();
      const result = cache.get('nonexistent');
      expect(result).toBeUndefined();
    });

    test('.put() with null value', () => {
      const cache = new ref();
      cache.put('key', null);
      const result = cache.get('key');
      expect(result).toBeNull();
    });

    test('.put() & .get()', () => {
      const cache = new ref();
      cache.put('key', 'value');
      const result = cache.get('key');
      expect(result).toBe('value');
    });

    test('.put() & .get() with object values', () => {
      const obj = { key: 'value' };
      const cache = new ref();
      cache.put('key', obj);
      const result = cache.get('key');
      expect(result).not.toBe(obj);
      expect(result).toEqual(obj);
    });

    test('.put() & .get() with object values, clone == false', () => {
      const obj = { key: 'value' };
      const cache = new lru(undefined, false);
      cache.put('key', obj);
      const result = cache.get('key');
      expect(result).toBe(obj);
      expect(result).toEqual(obj);
    });

    test('.put(), with existing key', () => {

      const cache = new ref();
      cache.put('key', 'value');

      let result = cache.get('key');
      expect(result).toBe('value');

      cache.put('key', 'new value');

      result = cache.get('key');
      expect(result).toBe('new value');

    });

    test('.delete()', () => {

      const cache = new ref();
      cache.put('key', 'value');

      let result = cache.get('key');
      expect(result).toBe('value');

      cache.delete('key');

      result = cache.get('key');
      expect(result).toBeUndefined();

    });

  });
}
