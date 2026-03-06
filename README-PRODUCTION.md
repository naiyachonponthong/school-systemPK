# ระบบจัดการบุคลากรโรงเรียน (School Personnel Management System)

## การติดตั้งบน Host จริง

### 1. อัปโหลดไฟล์
- อัปโหลดทุกไฟล์ในโปรเจคขึ้น host
- ยกเว้นโฟลเดอร์ `node_modules` และ `.env`

### 2. ตั้งค่า Host Control Panel
- **Application Root**: `/pkschoolsystem.pornsirikul.ac.th`
- **Document Root**: `/pkschoolsystem.pornsirikul.ac.th/public` ⭐
- **Application Startup File**: `server.js`

### 3. สร้างฐานข้อมูล
- สร้าง database ชื่อ `pkschool_personnel`
- ใน phpMyAdmin หรือ control panel

### 4. ตั้งค่าไฟล์ .env
- คัดลอกจาก `.env.production`
- แก้ไขค่า `DB_PASSWORD` ให้ถูกต้อง
- แก้ไข `JWT_SECRET` เป็นค่าที่ปลอดภัย

### 5. ติดตั้ง Dependencies
```bash
npm install
```

### 6. รันครั้งแรก
```bash
npm run prod
```
หรือให้ host รันอัตโนมัติ

### 7. ข้อมูลเข้าใช้งาน
- Username: `admin`
- Password: `admin123`

## การเข้าถึงระบบ
- URL: https://pkschoolsystem.pornsirikul.ac.th
- ระบบจะ redirect ไปหน้า login อัตโนมัติ

## หมายเหตุ
- ระบบจะสร้างตารางฐานข้อมูลอัตโนมัติ
- ระบบจะใส่ข้อมูลเริ่มต้นอัตโนมัติ
- แนะนำให้เปลี่ยนรหัสผ่าน admin หลังติดตั้ง
