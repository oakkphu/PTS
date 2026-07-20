/**
 * ตั้งค่าส่ง Email OTP จริง — แก้ไฟล์นี้เหมือนตอนใส่รหัส SQL ใน server.js
 *
 * thanvasu.com ใช้ Google Workspace → SMTP = smtp.gmail.com
 * ต้องใช้ "App Password" (รหัสผ่านแอป) ไม่ใช่รหัสล็อกอินปกติ
 * สร้างได้ที่: https://myaccount.google.com/apppasswords
 * (ต้องเปิด 2-Step Verification ก่อน)
 */
module.exports = {
    mode: 'smtp',

    // Google Workspace / Gmail SMTP
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: false,

    // อีเมลบริษัทที่ใช้ส่ง OTP
    smtpUser: 'businessdev@thanvasu.com',

    // ⚠️ ใส่ App Password 16 ตัว ของ Google ที่นี่ (เว้นวรรคหรือไม่ก็ได้)
    smtpPass: '',

    fromName: 'PTS Learning',
    fromEmail: 'businessdev@thanvasu.com',

    // ถ้ามี Brevo ให้ใส่คีย์ที่นี่แทนได้ (ปล่อยว่างได้)
    brevoApiKey: ''
};
