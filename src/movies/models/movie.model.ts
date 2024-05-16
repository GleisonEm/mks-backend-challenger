import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 500 })
  director: string;

  @Column('date')
  private _releaseDate: Date;

  get releaseDate(): Date {
    return this._releaseDate;
  }

  set releaseDate(value: string) {
    this._releaseDate = new Date(value);
  }
}
