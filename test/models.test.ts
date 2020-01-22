// import { Repository } from '../src/db/repository';
// import { ConfigValue } from '../src/model';
// import { Logger } from '../src/logger'
// import { getConfig } from '../src/config';
// import { RankingArbiter } from '../src/arbiter';
// import { DefaultResolver } from '../src/resolver';
// import { DefaultEvaluator } from '../src/evaluator';
// import { loadData } from '../src/util/data-loader';

// const config = getConfig();
// const repo = new Repository(config.db);

// beforeEach(async () => loadData(repo));

describe('stub test', () => { 
    test('stub', async () => {
        expect(true).toEqual(true);
    })
})

// describe('repo tests', () => {
//     test(`Criteria comes back from keyv store`, async () => {
//         const i18n = await repo.get('default', 'middle-i18n')
//         expect(i18n.value.specifics[0].criteria.size).toBeGreaterThan(0);
//     });
// })

// describe('i18n tests', () => {
//     let intl: ConfigValue;
//     let criteriaMap: Map<string, string>;
//     let resolver = new DefaultResolver();

//     beforeEach(async () => {
//         intl = await repo.get('default', 'middle-i18n');
//         criteriaMap = new Map();
//     })

//     test('Empty criteria gets default of "middle"', async () => {
//         expect(resolver.resolve(intl.value, criteriaMap)).toEqual('middle');
//     })

//     test('Spanish/Mexico gets default of "middle"', async () => {
//         criteriaMap.set('lang', 'es');
//         criteriaMap.set('region', 'mx');
//         expect(resolver.resolve(intl.value, criteriaMap)).toEqual('middle');
//     })
    
//     test('English/Canada should get default of "middle"', async () => {
//         criteriaMap.set('lang', 'en');
//         criteriaMap.set('region', 'ca');
//         expect(resolver.resolve(intl.value, criteriaMap)).toEqual('middle');
//     })
    
//     test('English/US should get variant of "center"', async () => {
//         criteriaMap.set('lang', 'en');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(intl.value, criteriaMap)).toEqual('center');
//     })

//     test('English/UK should get variant of "centre"', async () => {
//         criteriaMap.set('lang', 'en');
//         criteriaMap.set('region', 'uk');
//         expect(resolver.resolve(intl.value, criteriaMap)).toEqual('centre');
//     })
// });

// describe('Object Specificity Tests', () => {
//     let obj: ConfigValue;
//     let criteriaMap: Map<string, string>;
//     let resolver = new DefaultResolver();

//     beforeEach(async () => {
//         obj = await repo.get('default', 'json-obj-example');
//         criteriaMap = new Map();
//     })

//     test('Empty criteria gets default value', async () => {
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('default');
//     })

//     test('US/really-big-customer gets "cust-id-only" variant', async () => {
//         criteriaMap.set('customerId', 'really-big-customer');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('custid-only');
//     })
    
//     test('US/Bronze should get "us-bronze" variant', async () => {
//         criteriaMap.set('accountType', 'bronze');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('us-bronze');
//     })
    
//     test('US/Bronze/really-big-customer should get "us-bronze" variant', async () => {
//         // It should get bronze due to specificity ranking. 
//         criteriaMap.set('customerId', 'really-big-customer');
//         criteriaMap.set('accountType', 'bronze');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('us-bronze');
//     })
// });

// describe('Object Specificity Tests with Ranking', () => {
//     let obj: ConfigValue;
//     let criteriaMap: Map<string, string>;
//     let arbiter = new RankingArbiter(new Map([['customerId', 99]]));
//     let resolver = new DefaultResolver(new DefaultEvaluator(), arbiter);

//     beforeEach(async () => {
//         obj = await repo.get('default', 'json-obj-example');
//         criteriaMap = new Map();
//     })

//     // The next 3 tests are the same as above -- but validating with custom arbiter.
//     test('Empty criteria gets default value', async () => {
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('default');
//     })

//     test('US/really-big-customer gets "custid-only" variant', async () => {
//         criteriaMap.set('customerId', 'really-big-customer');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('custid-only');
//     })
    
//     test('US/Bronze should get "us-bronze" variant', async () => {
//         criteriaMap.set('accountType', 'bronze');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('us-bronze');
//     })
    
//     // This one is the meat and potatoes... 
//     // Thanks to field ranking, the "customerId" match should direct it to the custid-only type
//     test('US/Bronze/really-big-customer should NOW get "custid-only" variant', async () => {
//         criteriaMap.set('customerId', 'really-big-customer');
//         criteriaMap.set('accountType', 'bronze');
//         criteriaMap.set('region', 'us');
//         expect(resolver.resolve(obj.value, criteriaMap).type).toEqual('custid-only');
//     })
// });
