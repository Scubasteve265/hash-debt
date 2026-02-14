// Math utilities

export function lerp(a, b, t) {
    return a + (b - a) * Math.min(1, t);
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function normalizeAngle(angle) {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
}

export function isAngleInRange(angle, start, size) {
    const a = normalizeAngle(angle);
    const s = normalizeAngle(start);
    const end = normalizeAngle(start + Math.PI * 2 * size);

    if (end > s) {
        return a >= s && a <= end;
    } else {
        // Wraps around 0
        return a >= s || a <= end;
    }
}

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

export function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

export function generateHash(length = 8) {
    const chars = '0123456789ABCDEF';
    let hash = '';
    for (let i = 0; i < length; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}
