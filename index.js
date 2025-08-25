import { Kysely } from 'kysely';
import { SQLTable } from 'logic-sql-entity';

const major = "1.0.0";
const prt_display = new SQLTable('PRT_Display');
const prt_dispprt = new SQLTable('PRT_DispPrt');

prt_display.columns.addValue('aa', 10)
prt_display.columns.addValue('bb', 10)

prt_dispprt.columns.addValue('cc', 20)
prt_dispprt.columns.addValue('dd', 30)

export { prt_display, prt_dispprt, major }