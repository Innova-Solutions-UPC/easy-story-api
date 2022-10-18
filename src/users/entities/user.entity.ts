import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 25, type: 'varchar' })
  username: string;

  @Column({ unique: true, length: 50, type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ length: 96, type: 'varchar' })
  password: string;

  @Column({ length: 20, type: 'varchar' })
  firstName: string;

  @Column({ length: 20, type: 'varchar' })
  lastName: string;

  @Column({ length: 250, type: 'varchar', default: '' })
  bio: string;

  @Column({ default: 'PER' })
  country: string;

  @Column({ default: false, type: 'boolean' })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }
}
