export async function hashViewKey(
  ip: string,
  userAgent: string,
): Promise<string> {
  const data = `${ip}|${userAgent}`;
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(data),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
