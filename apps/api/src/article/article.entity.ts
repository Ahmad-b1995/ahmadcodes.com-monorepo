import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column('text')
  content!: string;

  @Column('text')
  excerpt!: string;

  @Column('jsonb')
  image!: {
    alt: string;
    src: string;
  };

  @Column({ default: false })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;

  @Column()
  metaDescription!: string;

  @Column('simple-array')
  tags!: string[];
}
