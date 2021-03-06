import { ConfigStore } from '../src/db/config-store';
import { ConfigValue } from '../src/model';
// import { Logger } from '../logger'
import { getConfig } from '../src/config';
import { RankingArbiter } from '../src/arbiter';
import { DefaultResolver } from '../src/resolver';
import { DefaultEvaluator } from '../src/evaluator';
import { loadData } from '../src/util/data-loader';
import * as Knex from 'knex';

const config = getConfig();
const store = new ConfigStore(config.db);
const db = Knex(config.db);    

beforeAll(async () => db.migrate.latest());
beforeEach(async () => loadData());

describe.only('repo tests', () => {
    test(`Criteria comes back from config store`, async () => {
        const i18n = await store.get('default', 'middle-i18n');
        expect(i18n.value.specifics[0].criteria.size).toBeGreaterThan(0);
    });
})

describe('i18n tests', () => {
    let intl: ConfigValue;
    let criteriaMap: Map<string, string>;
    let resolver = new DefaultResolver();

    beforeEach(async () => {
        intl = await store.get('default', 'middle-i18n');
        //console.log(intl);
        criteriaMap = new Map();
        return true;
    })

    test('Empty criteria gets default of "middle"', async () => {
        expect(resolver.resolve(intl.value, criteriaMap)).toEqual('middle');
        return true;
    })

    test('Spanish/Mexico gets default of "middle"', async () => {
        criteriaMap.set('lang', 'es');
        criteriaMap.set('region', 'mx');
        expect(resolver.resolve(intl.value, criteriaMap)).toEqual('middle');
        return true;
    })
    
    test('English/Canada should get default of "middle"', async () => {
        criteriaMap.set('lang', 'en');
        criteriaMap.set('region', 'ca');
        expect(resolver.resolve(intl.value, criteriaMap)).toEqual('middle');
        return true;
    })
    
    test('English/US should get variant of "center"', async () => {
        criteriaMap.set('lang', 'en');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(intl.value, criteriaMap)).toEqual('center');
        return true;
    })

    test('English/UK should get variant of "centre"', async () => {
        criteriaMap.set('lang', 'en');
        criteriaMap.set('region', 'uk');
        expect(resolver.resolve(intl.value, criteriaMap)).toEqual('centre');
        return true;
    })
});

describe('Object Specificity Tests', () => {
    let obj: ConfigValue;
    let criteriaMap: Map<string, string>;
    let resolver = new DefaultResolver();

    beforeEach(async () => {
        obj = await store.get('default', 'specificity-host');
        criteriaMap = new Map();
        return true;
    })

    test('Empty criteria gets default value', async () => {
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('base');
        return true;
    })

    test('US/really-big-customer gets "cust-id-only" variant', async () => {
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('custid-only');
        return true;
    })
    
    test('US/Bronze should get "us-bronze" variant', async () => {
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('us-bronze');
        return true;
    })
    
    test('US/Bronze/really-big-customer should get "us-bronze" variant', async () => {
        // It should get bronze due to specificity ranking. 
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('us-bronze');
        return true;
    })
});

describe('Object Specificity Tests with Ranking', () => {
    let obj: ConfigValue;
    let criteriaMap: Map<string, string>;
    let arbiter = new RankingArbiter(new Map([['customerId', 99]]));
    let resolver = new DefaultResolver(new DefaultEvaluator(), arbiter);

    beforeEach(async () => {
        obj = await store.get('default', 'specificity-host');
        criteriaMap = new Map();
    })

    // The next 3 tests are the same as above -- but validating with custom arbiter.
    test('Empty criteria gets default value', async () => {
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('base');
    })

    test('US/really-big-customer gets "custid-only" variant', async () => {
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('custid-only');
    })
    
    test('US/Bronze should get "us-bronze" variant', async () => {
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('us-bronze');
    })
    
    // This one is the meat and potatoes... 
    // Thanks to field ranking, the "customerId" match should direct it to the custid-only type
    test('US/Bronze/really-big-customer should NOW get "custid-only" variant', async () => {
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(resolver.resolve(obj.value, criteriaMap)).toEqual('custid-only');
    })
});
