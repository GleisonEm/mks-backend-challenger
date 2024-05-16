import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVideoTable1715757255407 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `movie` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `description` text NOT NULL, `director` varchar(255) NOT NULL, `releaseDate` date NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `movie`', undefined);
  }
}
