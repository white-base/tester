import { Kysely } from 'kysely';
import { SQLTable } from 'logic-sql-entity';

const major = "1.0.0 | 2.0.0";
const sto_account = new SQLTable('STO_Account');

sto_account.columns.addValue('aa', 10)
sto_account.columns.addValue('bb', 10)

export { sto_account, major }