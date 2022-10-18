import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostMetadata } from './post-metadata.entity';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';
import { PostStatus } from '../enums/post-status.enum';
import { PostAsset } from './post-asset.entity';

@Entity({
  name: 'posts',
})
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 100, type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Index()
  @Column({ length: 100, type: 'varchar', unique: true })
  slug: string;

  @Column({ length: 250, type: 'varchar' })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  priority: number;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @Column({ default: 0 })
  pricingValue: number;

  @Column({ default: '' })
  pricingCurrency: string;

  @Column({ default: '' })
  pricingDescription: string;

  @OneToMany(() => PostAsset, (asset) => asset.post, { eager: true })
  assets: PostAsset[];

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
    eager: true,
  })
  metadata: PostMetadata;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
