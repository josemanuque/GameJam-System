//Implementation of structure by chatGPT
//Reason: to make the code more efficiently
export class Dictionary<K extends readonly unknown[], V> {
    private map: Map<string, V>;
    private reverseMap: Map<string, K>;
  
  
      constructor(entries: [K, V][]) {
        this.map = new Map<string, V>();
        this.reverseMap = new Map<string, K>();
        entries.forEach(([key, value]) => {
          const keyString = JSON.stringify(key);
          this.map.set(keyString, value);
          this.reverseMap.set(JSON.stringify(value), key);
        });
      }
  
        get(key: K): V | undefined {
          return this.map.get(JSON.stringify(key));
        }
  
        getKey(value: V): K | undefined {
          return this.reverseMap.get(JSON.stringify(value));
        }
  
        toMap(): Map<K, V> {
          const map = new Map<K, V>();
          for (const [keyString, value] of this.map) {
            const key = JSON.parse(keyString) as K;
            map.set(key, value);
          }
          return map;
        }
  
  }