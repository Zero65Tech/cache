const {
    fn,
    fnSync,
    ttl,
    lru
  } = require('./index');
  
  describe('fn and fnSync', () => {
    test('Caching asynchronous function (fn)', async () => {
      const mockAsyncFn = jest.fn(async (x) => x * 2);
      const cache = new ttl(); // create an instance of ttl
      const cachedFn = fn(mockAsyncFn, cache);
  
      const result1 = await cachedFn(5);
      expect(result1).toBe(10);
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  
      const result2 = await cachedFn(5);
      expect(result2).toBe(10);
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
    });
  
    test('Caching synchronous function (fnSync)', () => {
      const mockSyncFn = jest.fn((x) => x * 2);
      const cache = new ttl(); // create an instance of ttl
      const cachedFnSync = fnSync(mockSyncFn, cache);
  
      const result1 = cachedFnSync(5);
      expect(result1).toBe(10);
      expect(mockSyncFn).toHaveBeenCalledTimes(1);
  
      const result2 = cachedFnSync(5);
      expect(result2).toBe(10);
      expect(mockSyncFn).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('ttl', () => {
    test('Caching with time-to-live', async () => {
      const mockAsyncFn = jest.fn(async (x) => x * 2);
      const cache = ttl(1); 
      const cachedFn = fn(mockAsyncFn, cache);

      const result1 = await cachedFn(5);
      expect(result1).toBe(10);
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
 
      await new Promise((resolve) => setTimeout(resolve, 1100));
  
      const result2 = await cachedFn(5);
      expect(result2).toBe(10);
      expect(mockAsyncFn).toHaveBeenCalledTimes(2); 
    });
  });
  
  describe('lru', () => {
    test('Caching with least recently used strategy', () => {
      const mockSyncFn = jest.fn((x) => x * 2);
      const cache = lru(2); 
      const cachedFnSync = fnSync(mockSyncFn, cache);

      const result1 = cachedFnSync(5);
      const result2 = cachedFnSync(10);
      expect(result1).toBe(10);
      expect(result2).toBe(20);
      expect(mockSyncFn).toHaveBeenCalledTimes(2);

      const result3 = cachedFnSync(5);
      expect(result3).toBe(10);
      expect(mockSyncFn).toHaveBeenCalledTimes(2); 

      const result4 = cachedFnSync(15);
      expect(result4).toBe(30);
      expect(mockSyncFn).toHaveBeenCalledTimes(3); 
    });
  });
  