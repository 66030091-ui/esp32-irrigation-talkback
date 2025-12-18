// api/status.js
module.exports = async (req, res) => {
  try {
    const CH = process.env.TELEM_CHANNEL_ID;
    const RK = process.env.TELEM_READ_KEY || '';

    if (!CH) {
      res.status(500).send('missing TELEM_CHANNEL_ID');
      return;
    }

    const readField = async (n) => {
      const u = new URL(`https://api.thingspeak.com/channels/${CH}/fields/${n}/last.txt`);
      if (RK) u.searchParams.set('api_key', RK);
      const r = await fetch(u);
      return r.ok ? (await r.text()).trim() : '';
    };

    // mapping:
    // 1=moist, 2=pump, 3=mode, 4=N, 5=P, 6=K, 7=max_on_min
    const [moist, pump, mode, n, p, k, maxOn] = await Promise.all([
      readField(1), readField(2), readField(3),
      readField(4), readField(5), readField(6),
      readField(7)
    ]);

    const toNumOrNull = (v) => (v !== '' && !Number.isNaN(Number(v))) ? Number(v) : null;

    res.setHeader('Content-Type','application/json');
    res.status(200).send(JSON.stringify({
      moisture_percent: toNumOrNull(moist),
      pump_state: toNumOrNull(pump),
      mode: toNumOrNull(mode),

      npk_n: toNumOrNull(n),
      npk_p: toNumOrNull(p),
      npk_k: toNumOrNull(k),

      max_on_min: toNumOrNull(maxOn)
    }));
  } catch(e){
    console.error(e);
    res.status(500).send('error');
  }
};
