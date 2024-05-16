import { Injectable } from '@nestjs/common';
import { UpdateDateColumn } from 'typeorm';

@Injectable()
export abstract class HashingService {
  abstract hash(data: string | Buffer): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
