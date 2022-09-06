import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'posts',
})
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, type: 'varchar' })
  title: string;

  @Column({ length: 100, type: 'varchar', unique: true })
  slug: string;

  @Column({ length: 100, type: 'varchar' })
  description: string;

  @Column({ length: 100, type: 'varchar' })
  content: string;

  @Column({ length: 100, type: 'varchar' })
  image: string;

  @ManyToOne(() => User, (author) => author.posts)
  author: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
