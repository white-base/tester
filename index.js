import { Kysely } from 'kysely';
import { SQLTable } from 'logic-sql-entity';
import { sto_master } from '@logicfeel/store-core';

const major = "1.0.0";
const prt_master = new SQLTable('PRT_Master');


export { sto_master, prt_master, major }