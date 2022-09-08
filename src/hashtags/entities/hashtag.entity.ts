import { Post } from '../../posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'hashtags',
})
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 25, type: 'varchar' })
  name: string;

  @ManyToMany(() => Post, (post) => post.hashtags)
  posts: Post[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
