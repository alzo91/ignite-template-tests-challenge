import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterColumnTypeFromStatements1630263167890
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // { name: 'type', type: 'enum', enum: ['deposit', 'withdraw'] }
    await queryRunner.changeColumn(
      "statements",
      "type",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw", "transfer"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      "type",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw"],
      })
    );
  }
}
