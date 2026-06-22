export function makeJwt(payload: Record<string, unknown>): string {
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = base64UrlEncode(JSON.stringify(payload));
    const signature = base64UrlEncode('signature');
    return `${header}.${body}.${signature}`;
}

export function futureExp(secondsAhead = 3600): number {
    return Math.floor(Date.now() / 1000) + secondsAhead;
}

export function pastExp(secondsAgo = 3600): number {
    return Math.floor(Date.now() / 1000) - secondsAgo;
}

function base64UrlEncode(value: string): string {
    const b64 =
        typeof btoa === 'function'
            ? btoa(value)
            : Buffer.from(value, 'utf-8').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}