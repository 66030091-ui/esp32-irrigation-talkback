// api/status.js
module.exports = async (req, res) => {
  try {
    const CH = process.env.TELEM_CHANNEL_ID;
    const RK = process.env.TELEM_READ_KEY || '';
    const readField = async (n) => {
      const u = new URL(`https://api.thingspeak.com/channels/${CH}/fields/${n}/last.txt`);
      if (RK) u.searchParams.set('api_key', RK);
      const r = await fetch(u);
      return r.ok ? (await r.text()).trim() : '';
    };
    const [moist, pump, mode] = await Promise.all([
      readField(1), readField(2), readField(3)
    ]);
    res.setHeader('Content-Type','application/json');
    res.status(200).send(JSON.stringify({
      moisture_percent: moist ? Number(moist) : null,
      pump_state: pump ? Number(pump) : null,
      mode: mode ? Number(mode) : null
    }));
  } catch(e){
    console.error(e);
    res.status(500).send('error');
  }
};
