import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Expose()
  edited(): boolean {
    return this.updatedAt !== this.createdAt;
  }

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
