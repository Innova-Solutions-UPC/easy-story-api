import { Exclude } from 'class-transformer';
import { Post } from '../../posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ length: 96, type: 'varchar' })
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
