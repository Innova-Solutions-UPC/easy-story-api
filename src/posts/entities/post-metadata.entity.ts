import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({
  name: 'post_metadata',
})
export class PostMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  views: number;

  @Column('int', { default: 0 })
  shares: number;

  @OneToOne(() => Post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;
}
