import { Repository } from './db/repository';
import { ConfigValue, defaultEvaluator, Arbiter, ConfigEntry, defaultArbiter } from './models';
import { inspect } from 'util';
import { Logger } from './logger'
import { ConfigConfig, getConfig } from './config';

const config = getConfig();
const repo = new Repository(config.dbUrl);


class RankingArbiter {
    getCriteriaRank(name: string): number {
        switch(name) {
            case 'customerId':
                return 99;
            default:
                return 1;
        }
    }

    arbitrate(items: ConfigEntry[], criteria: Map<string, string>): ConfigEntry {
        // In this ranking arbiter, we assign a point value to each field name
        // See the above getCriteriaRank() method

        const sortedCandidates = items.sort((a, b) => {
            let aValue = 0;
            let bValue = 0;

            for (let key of a.criteria.keys()) {
                aValue += this.getCriteriaRank(key);
            }
              
            for (let key of b.criteria.keys()) {
                bValue += this.getCriteriaRank(key);
            }

            return bValue - aValue;
        });

        if (sortedCandidates.length < 1) {
            Logger.getInstance().warn(`Ranking Arbiter resulted in zero ranks: ${inspect(items, false, 4)}`);
        }

        return sortedCandidates[0];
    }
}


beforeEach(async () => prepareDb());

describe('repo tests', () => {
    test(`Criteria comes back from keyv store`, async () => {
        const i18n = await repo.get('default', 'middle-i18n')
        expect(i18n.value.specifics[0].criteria.size).toBeGreaterThan(0);
    });

})

describe('i18n tests', () => {
     let intl: ConfigValue;
     let criteriaMap: Map<string, string>;

    beforeEach(async () => {
        intl = await repo.get('default', 'middle-i18n');
        criteriaMap = new Map();
    })

    test('Empty criteria gets default of "middle"', async () => {
        expect(intl.evaluate(criteriaMap)).toEqual('middle');
    })

    test('Spanish/Mexico gets default of "middle"', async () => {
        criteriaMap.set('lang', 'es');
        criteriaMap.set('region', 'mx');
        expect(intl.evaluate(criteriaMap)).toEqual('middle');
    })
    
    test('English/Canada should get default of "middle"', async () => {
        criteriaMap.set('lang', 'en');
        criteriaMap.set('region', 'ca');
        expect(intl.evaluate(criteriaMap)).toEqual('middle');
    })
    
    test('English/US should get variant of "center"', async () => {
        criteriaMap.set('lang', 'en');
        criteriaMap.set('region', 'us');
        expect(intl.evaluate(criteriaMap)).toEqual('center');
    })

    test('English/UK should get variant of "centre"', async () => {
        criteriaMap.set('lang', 'en');
        criteriaMap.set('region', 'uk');
        expect(intl.evaluate(criteriaMap)).toEqual('centre');
    })
});

describe('Object Specificity Tests', () => {
    let obj: ConfigValue;
    let criteriaMap: Map<string, string>;

    beforeEach(async () => {
        obj = await repo.get('default', 'json-obj-example');
        criteriaMap = new Map();
    })

    test('Empty criteria gets default value', async () => {
        expect(obj.evaluate(criteriaMap).type).toEqual('default');
    })

    test('US/really-big-customer gets "cust-id-only" variant', async () => {
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('region', 'us');
        expect(obj.evaluate(criteriaMap).type).toEqual('custid-only');
    })
    
    test('US/Bronze should get "us-bronze" variant', async () => {
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(obj.evaluate(criteriaMap).type).toEqual('us-bronze');
    })
    
    test('US/Bronze/really-big-customer should get "us-bronze" variant', async () => {
        // It should get bronze due to specificity ranking. 
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(obj.evaluate(criteriaMap).type).toEqual('us-bronze');
    })
});

describe('Object Specificity Tests with Ranking', () => {
    let obj: ConfigValue;
    let criteriaMap: Map<string, string>;
    let arbiter = new RankingArbiter();

    beforeEach(async () => {
        obj = await repo.get('default', 'json-obj-example');
        criteriaMap = new Map();
    })

    // The next 3 tests are the same as above -- but validating with custom arbiter.
    test('Empty criteria gets default value', async () => {
        expect(obj.evaluate(criteriaMap, defaultEvaluator, arbiter).type).toEqual('default');
    })

    test('US/really-big-customer gets "custid-only" variant', async () => {
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('region', 'us');
        expect(obj.evaluate(criteriaMap, defaultEvaluator, arbiter).type).toEqual('custid-only');
    })
    
    test('US/Bronze should get "us-bronze" variant', async () => {
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(obj.evaluate(criteriaMap, defaultEvaluator, arbiter).type).toEqual('us-bronze');
    })
    
    // This one is the meat and potatoes... 
    // Thanks to field ranking, the "customerId" match should direct it to the custid-only type
    test('US/Bronze/really-big-customer should NOW get "custid-only" variant', async () => {
        // It should get bronze due to specificity ranking. 
        criteriaMap.set('customerId', 'really-big-customer');
        criteriaMap.set('accountType', 'bronze');
        criteriaMap.set('region', 'us');
        expect(obj.evaluate(criteriaMap, defaultEvaluator, arbiter).type).toEqual('custid-only');
    })
});


async function prepareDb() {
    const i18n = ConfigValue.fromJson({
        "namespace": "default",
        "key": "middle-i18n",
        "value": {
            "base": "middle",
            "specifics": [
                {
                    "value": "center",
                    "criteria": {
                        "region": "us",
                        "lang": "en"
                    }
                }, {
                    "value": "centre",
                    "criteria": {
                        "region": "uk",
                        "lang": "en"
                    }
                }
            ]
        }
    });

    const objectConfig = ConfigValue.fromJson({
        "namespace": "default",
        "key": "json-obj-example",
        "value": {
            "base": {
                "type": "default",
                "size": 20,
                "refillRate": 300,
                "refillSize": 20
            },
            "specifics": [
                { 
                    "value": {
                        "type": "custid-only",
                        "size": 500,
                        "refillRate": 1,
                        "refillSize": 3
                    },
                    "criteria": {
                        "customerId": "really-big-customer"
                    }
                },{
                    "value": {
                        "type": "us-bronze",
                        "size": 3,
                        "refillRate": 1,
                        "refillSize": 1
                    },
                    "criteria": {
                        "region": "us",
                        "accountType": "bronze"
                    }
                }
            ]
        }
    });

    // const sqlConfig = ConfigValue.fromJson({
    //     "namespace": "default",
    //     "key": "sql-by-custid",
    //     "value": {
    //         "base": "mysql.example.com",
    //         "specifics": [
    //             { 
    //                 "value": "mysql-big-customer-1.example.com",
    //                 "criteria": {
    //                     "accountId": "big-customer-id-1"
    //                 }
    //             },{
    //                 "value": "mysql-big-customer-2.example.com",
    //                 "criteria": {
    //                     "accountId": "big-customer-id-2"
    //                 }
    //             }
    //         ]
    //     }    
    // });     

    try {
        await repo.set(i18n.namespace, i18n.key, i18n);
        await repo.set(objectConfig.namespace, objectConfig.key, objectConfig);
        // await repo.set(sqlConfig.namespace, sqlConfig.key, sqlConfig);
    } catch (e) {
        Logger.getInstance().error(e);
        throw e;
    }
}

