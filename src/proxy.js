import express from 'express';
import fetch from 'node-fetch';

import { getResponse, setResponse } from './cache.js';
import { timerStart, timerEnd } from './time.js';

export const router = express.Router();

router.get('/proxy', async (req, res) => {
  const { period, type } = req.query;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  const key = `${period}:${type}`;
  let result;
  let timeEnd;

  const timeSince = timerStart();

  try {
    result = await getResponse(key);
  } catch (e) {
    console.error('error getting from cache', e);
    console.warn(`unable to get from cache, ${key}, ${e.message}`);
  }

  if (result) {
    timeEnd = timerEnd(timeSince);
    const data = {
      data: JSON.parse(result),
      info: {
        cached: true,
        time: timeEnd,
      },
    };
    res.json(data);
    return;
  }

  // not in cache so getting the data and setting it to cache
  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja gögn frá vefþjónustu', e);
    res.status(500).send('Villa við að sækja gögn frá vefþónustu');
    return;
  }

  if (!result.ok) {
    console.error('Villa frá vefþjónustu', await result.text());
    res.status(500).send('Villa við að sækja gögn frá vefþjónustu');
    return;
  }

  const resultText = await result.text();
  await setResponse(key, resultText);
  timeEnd = timerEnd(timeSince);

  const data = {
    data: JSON.parse(resultText),
    info: {
      cached: false,
      time: timeEnd,
    },
  };
  res.json(data);
});
