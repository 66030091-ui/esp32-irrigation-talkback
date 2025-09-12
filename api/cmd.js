// api/cmd.js
// Usage: /api/cmd?c=MODE:AUTO  or  /api/cmd?c=PUMP:ON
module.exports = async (req, res) => {
  try {
    const TALKBACK_ID  = process.env.TALKBACK_ID;
    const WRITE_KEY    = process.env.TALKBACK_WRITE_KEY;

    const c = (req.query.c || '').trim();
    if (!c) return res.status(400).send('missing command');

    const url = `https://api.thingspeak.com/talkbacks/${TALKBACK_ID}/commands.json`;
    const body = new URLSearchParams();
    body.set('api_key', WRITE_KEY);
    body.set('command_string', c);

    const r = await fetch(url, { method: 'POST', body });
    if (!r.ok) throw new Error('talkback add failed');

    res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    res.status(500).send('error');
  }
};
