// api/cmd.js
// Usage: /api/cmd?c=MODE:AUTO  /api/cmd?c=PUMP:ON  /api/cmd?c=MAXON:10  /api/cmd?c=THRESH:35:45
module.exports = async (req, res) => {
  try {
    const TALKBACK_ID  = process.env.TALKBACK_ID;
    const WRITE_KEY    = process.env.TALKBACK_WRITE_KEY;

    const CH           = process.env.TELEM_CHANNEL_ID;
    const CH_WRITE_KEY = process.env.TELEM_CHANNEL_WRITE_KEY; // ✅ ต้องใส่ใน ENV

    const c = (req.query.c || '').trim();
    if (!c) return res.status(400).send('missing command');

    // 1) ส่งคำสั่งไป TalkBack
    const url = `https://api.thingspeak.com/talkbacks/${TALKBACK_ID}/commands.json`;
    const body = new URLSearchParams();
    body.set('api_key', WRITE_KEY);
    body.set('command_string', c);

    const r = await fetch(url, { method: 'POST', body });
    if (!r.ok) throw new Error('talkback add failed');

    // 2) ถ้าเป็น MAXON ให้เขียนค่าไป field7 เพื่อให้หน้าแดชบอดอ่านกลับมาโชว์ได้
    // field7 = max_on_min
    if (c.startsWith('MAXON:')) {
      const vStr = c.split(':')[1];
      const v = Number(vStr);

      if (!Number.isNaN(v) && CH && CH_WRITE_KEY) {
        const u = new URL('https://api.thingspeak.com/update');
        u.searchParams.set('api_key', CH_WRITE_KEY);
        u.searchParams.set('field7', String(v));

        const rr = await fetch(u);
        if (!rr.ok) console.warn('ThingSpeak update field7 failed');
      }
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    res.status(500).send('error');
  }
};
