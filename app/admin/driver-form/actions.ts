export function generateExpiringLink(): string {
  const currentTime = Date.now();
  const expiresIn = 60 * 60 * 1000; // 1 hour in milliseconds
  const expiryTime = currentTime + expiresIn;

  // Token format: timestamp
  const token = `${expiryTime}`;
  const link = `https://busyminis.com/driver-application?token=${token}`;

  return link;
}
