# TalkBack Irrigation (Vercel)

โครงสำหรับหน้าเว็บควบคุมรดน้ำด้วย ESP32 + ThingSpeak TalkBack พร้อม Serverless Functions บน Vercel

## โครงสร้าง
```
.
├─ index.html
├─ styles.css
└─ api/
   ├─ cmd.js        # เพิ่มคำสั่งลง TalkBack
   └─ status.js     # (ออปชัน) อ่าน Telemetry ล่าสุดมาโชว์หน้าเว็บ
```

## ตัวแปรแวดล้อม (Vercel → Project Settings → Environment Variables)
- `TALKBACK_ID`            = TalkBack ID
- `TALKBACK_WRITE_KEY`     = TalkBack API Key (Write)
- `TELEM_CHANNEL_ID`       = Channel ID ของ Telemetry
- `TELEM_READ_KEY`         = Read Key ของ Telemetry (ถ้า private)

จากนั้นกด Redeploy ให้ ENV มีผล

## ใช้งาน
- เปิดหน้าเว็บ:
  - Toggle โหมด → `/api/cmd?c=MODE:AUTO|MANUAL`
  - เปิด/ปิดปั๊ม (Manual) → `/api/cmd?c=PUMP:ON|OFF`
  - ตั้ง Threshold → `/api/cmd?c=THRESH:<LOW>:<HIGH>` (เช่น `THRESH:35:45`)
  - ตั้งเวลาสูงสุดที่อนุญาตให้ปั๊มเปิด (นาที) → `/api/cmd?c=MAXON:<MIN>`

> ESP32 จะ `execute` คำสั่งทีละรายการจาก TalkBack และอัปเดต Telemetry (Field1=moisture, Field2=pump, Field3=mode)

## หมายเหตุ
- ห้ามใส่ API Key ลงใน front-end โดยตรง ให้เรียกผ่าน `/api/*` เท่านั้น
- รักษาเรตลิมิตของ ThingSpeak (อัปเดต/อ่านไม่ถี่เกิน 15 วินาทีต่อแชนแนล)
- โค้ด ESP32 ตัวอย่างให้ดูในแชต (ส่วนของ TalkBack execute + ฮิสเทอรีซิส)
