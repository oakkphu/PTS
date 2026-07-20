/**
 * ตั้งค่าอีเมล "ผู้ส่ง" ของระบบ (SMTP) — แก้ไฟล์นี้เหมือนรหัส SQL ใน server.js
 *
 * สำคัญ:
 * - smtpUser / fromEmail = เมลบริษัทที่ใช้ "ส่งออก" เท่านั้น (1 กล่อง)
 * - OTP จะถูกส่งไปหาอีเมลของผู้ใช้ทุกคนที่มีในระบบ (Gmail, Hotmail, บริษัท ฯลฯ)
 *   ไม่จำกัดแค่เมลเดียว
 *
 * thanvasu.com ใช้ Google Workspace → SMTP = smtp.gmail.com
 * ใช้ App Password: https://myaccount.google.com/apppasswords
 */
module.exports = {
    mode: 'smtp',

    // ช่องทางส่งออก (ผู้ส่งของระบบ)
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: false,

    // บัญชี SMTP ที่ใช้ล็อกอินส่งเมล (เมลบริษัท 1 อัน)
    smtpUser: 'businessdev@thanvasu.com',

    // ⚠️ ใส่ App Password 16 ตัว ของบัญชีด้านบน
    smtpPass: '',

    // ชื่อ/อีเมลที่ผู้ใช้เห็นในช่อง From
    fromName: 'PTS Learning',
    fromEmail: 'businessdev@thanvasu.com',

    brevoApiKey: ''
};
