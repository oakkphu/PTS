const fs = require('fs');
const path = require('path');

const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');
const HERO_DIR = path.join(UPLOADS_ROOT, 'hero');

/** รูปสำรองเมื่อไฟล์ในเครื่องหาย (CDN สาธารณะ) */
const FALLBACK_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80'
];

function ensureHeroDir() {
    fs.mkdirSync(HERO_DIR, { recursive: true });
    fs.mkdirSync(path.join(UPLOADS_ROOT, 'avatars'), { recursive: true });
}

function listLocalHeroFiles() {
    ensureHeroDir();
    try {
        return fs.readdirSync(HERO_DIR)
            .filter((name) => /\.(jpe?g|png|webp|gif)$/i.test(name))
            .sort();
    } catch (_) {
        return [];
    }
}

function localUploadExists(urlPath) {
    if (!urlPath || !String(urlPath).startsWith('/uploads/')) return false;
    const rel = String(urlPath).replace(/^\/uploads\//, '').replace(/\//g, path.sep);
    const abs = path.join(UPLOADS_ROOT, rel);
    // กัน path traversal
    if (!abs.startsWith(UPLOADS_ROOT)) return false;
    try {
        return fs.existsSync(abs) && fs.statSync(abs).isFile();
    } catch (_) {
        return false;
    }
}

/**
 * แปลงค่า image_url จาก DB ให้เป็น URL ที่เบราว์เซอร์ใช้ได้
 * - Windows path / path ผิดรูป → /uploads/hero/filename
 * - ไฟล์ในเครื่องหาย → ใช้ไฟล์ hero อื่นที่มี หรือ CDN สำรอง
 */
function normalizeHeroImageUrl(imageUrl, slideIndex = 0) {
    let raw = String(imageUrl || '').trim();
    if (!raw) {
        return pickFallback(slideIndex);
    }

    // ลิงก์ภายนอกใช้ได้เลย
    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    // ดึงชื่อไฟล์จาก path แบบ Windows หรือ relative
    const winMatch = raw.replace(/\\/g, '/').match(/(?:^|\/)uploads\/(hero|avatars)\/([^/?#]+)$/i);
    if (winMatch) {
        raw = `/uploads/${winMatch[1].toLowerCase()}/${winMatch[2]}`;
    } else if (!raw.startsWith('/')) {
        // ชื่อไฟล์ล้วน
        if (/\.(jpe?g|png|webp|gif)$/i.test(raw)) {
            raw = `/uploads/hero/${path.basename(raw)}`;
        }
    }

    if (raw.startsWith('/uploads/')) {
        if (localUploadExists(raw)) return raw;
        // ไฟล์หาย — ลองใช้รูป hero อื่นในโฟลเดอร์
        const locals = listLocalHeroFiles();
        if (locals.length) {
            const pick = locals[Math.abs(slideIndex) % locals.length];
            return `/uploads/hero/${pick}`;
        }
        return pickFallback(slideIndex);
    }

    return raw || pickFallback(slideIndex);
}

function pickFallback(slideIndex = 0) {
    return FALLBACK_HERO_IMAGES[Math.abs(slideIndex) % FALLBACK_HERO_IMAGES.length];
}

function mapHeroSlidesImages(rows) {
    return (rows || []).map((row, index) => ({
        ...row,
        image_url: normalizeHeroImageUrl(row.image_url, index),
        image_missing: !!(row.image_url && String(row.image_url).startsWith('/uploads/') && !localUploadExists(String(row.image_url).trim()))
    }));
}

module.exports = {
    HERO_DIR,
    UPLOADS_ROOT,
    FALLBACK_HERO_IMAGES,
    ensureHeroDir,
    listLocalHeroFiles,
    localUploadExists,
    normalizeHeroImageUrl,
    mapHeroSlidesImages
};
