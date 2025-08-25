import { Kysely } from 'kysely';
import { SQLTable } from 'logic-sql-entity';

const major = "2.0.0";
const sto_master = new SQLTable('STO_Master');


export { sto_master, major }