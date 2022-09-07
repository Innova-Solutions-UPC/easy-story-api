import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostMetadata } from './post-metadata.entity';

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

  @OneToOne(() => PostMetadata, (metadata) => metadata.post, {
    cascade: true,
  })
  metadata: PostMetadata;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
