import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('r_users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 50, type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ length: 100, type: 'varchar' })
  password: string;

  @Column({ length: 20, type: 'varchar' })
  firstName: string;

  @Column({ length: 20, type: 'varchar' })
  lastName: string;

  @Column({ default: false, type: 'boolean' })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
