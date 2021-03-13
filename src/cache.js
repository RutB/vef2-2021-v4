/*import redis from 'redis';
import util from 'util';

const redisOptions = {
  url: 'redis://127.0.0.1:6379/0',
};

const client = redis.createClient(redisOptions);

const asyncGet = util.promisify(client.get).bind(client);
const asyncSet = util.promisify(client.set).bind(client);

export async function getResponse(key) {
  const get = await asyncGet(key);

  if (get) {
    return get;
  }
  return null;
}

export async function setResponse(key, data) {
  await asyncSet(key, data);
}
*/
