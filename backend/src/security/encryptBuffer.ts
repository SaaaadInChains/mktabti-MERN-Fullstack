import crypto from "crypto";

const ENC_ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const base64 = process.env.ENC_KEY;
  if (!base64) {
    throw new Error("Missing encryption key in dotenv");
  }
  const key = Buffer.from(base64, "base64");
  if (key.length !== 32) {
    throw new Error("Encryption lenght key error");
  }
  return key;
}

export function encryptBuffer(buffer: Buffer): Buffer {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENC_ALGO, key, iv);
  const cipherText = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, cipherText]);
}

export function getEncryptionMeta() {
  return { algo: ENC_ALGO, ivBytes: 12, tagBytes: 16 };
}
