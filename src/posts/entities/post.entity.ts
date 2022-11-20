import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostMetadata } from './post-metadata.entity';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';
import { PostStatus } from '../enums/post-status.enum';

@Entity({
  name: 'posts',
})
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Column({ length: 100, type: 'varchar', unique: true })
  slug: string;

  @Column({  type: 'text', default: '' })
  description: string;

  @Column({  type: 'text', default: '' })
  content: string;

  @Column({ type: 'varchar', default: '' })
  image: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'posts_hashtags',
  })
  hashtags: Hashtag[];

  @OneToOne(() => PostMetadata, (metadata) => metadata.post, {
    cascade: true,
  })
  metadata: PostMetadata;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
