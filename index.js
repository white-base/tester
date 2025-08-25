import { Kysely } from 'kysely';
import { SQLTable } from 'logic-sql-entity';

const major = "1.0.0";
const prt_category = new SQLTable('PRT_Category');


export { prt_category, major }