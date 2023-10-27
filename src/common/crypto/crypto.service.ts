import { Injectable } from '@nestjs/common';
import { createDecipheriv, createCipheriv } from 'crypto';
import { GENERAL } from '../../const/general.const';

@Injectable()
export class CryptoService {
  private algorithm = 'aes-256-cbc';
  private key = Buffer.from(GENERAL.JWT.ENCRYPT_DECRYPT_SECRET, 'base64');
  private iv = this.key.subarray(0, 16);

  async decrypt(text: any) {
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async encrypt(text: any) {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }
}
