import short from 'short-uuid';

// Generate a public-facing id from a prefix.
// Eg. "rept_d8Tdpd90Ucdl32nERfx"
export function generateId(prefix: string) {
    return prefix + short.generate();
}
