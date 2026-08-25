# ⚔️ Spiki Bot — Intelligent Auto-Farm Assistant for Spiki RPG

> **An advanced, zero-latency automation assistant and combat bot for [Spiki RPG](https://speakirpg.overture.io.kr/).**  
> Built with a high-performance Three.js engine hook and direct WebSocket packet dispatcher.

---

## ⚡ Quick Start (รันผ่าน Console ในบรรทัดเดียว)

1. เปิดหน้าเว็บเกม [Spiki RPG](https://speakirpg.overture.io.kr/) ในเบราว์เซอร์
2. กด **F12** เพื่อเปิด Developer Tools แล้วเลือกแท็บ **Console**
3. คัดลอกคำสั่งด้านล่างนี้ไปวางแล้วกด **Enter**:

```javascript
fetch('https://raw.githubusercontent.com/Yusinz-Zero/spikimmo-bot/main/auto_bot.js?t=' + Date.now()).then(r => r.text()).then(eval);
```

4. **คลิกที่ตัวมอนสเตอร์บนจอเกม 1 ครั้ง** จากนั้นกดปุ่มลูกศรขึ้น **`[↑]`** แล้วกด **`[Enter]`** บอทจะเริ่มทำงานทันที! 🚀

---

## 🌟 Key Features (ฟีเจอร์เด่น)

### 🗡️ 1. ระบบต่อสู้และฟาร์มมอนสเตอร์ (Combat & Farming)
* **Direct Packet Attack:** ส่งคำสั่งโจมตีและสกิลตรงเข้าเซิร์ฟเวอร์แบบ Zero-Latency
* **Smart Skill Combo & Rotation:** ร่ายสกิลอัตโนมัติต่อเนื่องทุกสกิลที่พร้อมใช้งาน (ไม่ข้ามสกิล)
* **Level-Based Monster Filter:** เลือกระดับเลเวลมอนสเตอร์ที่ต้องการตีได้ (เช่น เลเวลเท่าเราหรือมากกว่าไม่เกิน +3 เลเวล)
* **Specific Target Lock:** ล็อคเป้าเจาะจงเฉพาะชื่อมอนสเตอร์ที่ต้องการ
* **Custom Farm Radius & Anchor:** ปักหมุดจุดศูนย์กลางการฟาร์ม และจำกัดรัศมีไม่ให้ตัวละครวิ่งหลุดออกนอกโซน

### 🗺️ 2. ระบบนำทางและเปลี่ยนแมพโลกจริง (World Map Router)
* **Topological World Map Graph:** เดินทางข้ามประตูมิติต่อเนื่องหลายแมพได้ถูกต้อง ไม่เดินวนหรือติดบัคหน้าประตู
* **Auto Progress Map:** ตรวจจับเลเวลผู้เล่นและเดินเปลี่ยนแมพไปยังแมพที่เหมาะสมกับเลเวลอัตโนมัติ
* **Speed Booster:** ปรับเร่งความเร็วในการเดินได้สูงสุดถึง **15.0 m/s**

### 🛡️ 3. ระบบความปลอดภัยและการเอาชีวิตรอด (Survival & Safety)
* **Auto Dodge Danger Skills:** เดินหลบวงแดงสกิลของมอนสเตอร์อัตโนมัติแบบ 0-Delay
* **Instant Auto Heal:** ตรวจจับเลือดและดื่มยาฮีลอัตโนมัติตาม % ที่กำหนด
* **Instant Auto Revive:** เกิดใหม่ทันทีใน 0 วินาทีเมื่อตัวละครตาย และกลับมาฟาร์มต่ออัตโนมัติ

### 🎨 4. หน้าต่างควบคุมแบบ Modern Dark UI
* หน้าต่างควบคุมโปร่งแสง สไตล์ Modern Dark Glassmorphism
* ย่อ/ขยาย และลากย้ายตำแหน่งหน้าต่างได้อย่างอิสระ
* แปลชื่อมอนสเตอร์ภาษาเกาหลีเป็น **English Localization (100+ ตัว)**

---

## ⌨️ คีย์ลัด (Hotkeys)

| ปุ่ม | คำอธิบาย |
| :--- | :--- |
| **`[Insert]`** | ซ่อน / แสดงหน้าต่างควบคุมบอท (Toggle UI) |
| **`[↑]` + `[Enter]`** | รันคำสั่ง Hook เกมใน Console ทันที |

---

## 📂 โครงสร้างเมนูบอท (Bot Tabs)

1. **Status & Controls:** ดูค่าสถานะ HP, มอนสเตอร์เป้าหมาย, แมพปัจจุบัน, ปรับ Tick Interval และปุ่ม Start / Stop Bot
2. **Combat:** ปรับระยะโจมตี (Attack Range), ระบบเปิด/ปิดใช้สกิล, Auto Heal, Auto Revive และ Auto Dodge
3. **Navigation:** ปรับความเร็วเดิน (Walk Speed), เลือกแมพเป้าหมาย, ระบบ Auto Progress Map และระบบเดินไปพิกัด (Go to X, Z)
4. **Farming:** ตัวกรองมอนสเตอร์, ตัวกรองช่วงเลเวล (Level Filter), ปักหมุดจุดฟาร์ม (Anchor Position) และรัศมีการค้นหา
5. **Credits & Info:** ข้อมูลผู้พัฒนา และคีย์ลัดการใช้งาน

---

## 👨‍💻 Credits & Author

* **Developer:** [Yusinz-Zero](https://github.com/Yusinz-Zero)
* **Project Repository:** [spiki-bot](https://github.com/Yusinz-Zero/spikimmo-bot)

---

## ⚠️ Disclaimer

สคริปต์นี้สร้างขึ้นเพื่อการศึกษาและการทดลองระบบ Web Automation / Game Engine Hooking เท่านั้น ผู้ใช้ควรใช้งานด้วยความระมัดระวัง
