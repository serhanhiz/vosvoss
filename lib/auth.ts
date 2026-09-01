import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vosvos_secret_jwt_key_2026_super_secure';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { id: string; email: string; name?: string | null }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { id: string; email: string; name?: string | null } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; name?: string | null };
  } catch {
    return null;
  }
}
