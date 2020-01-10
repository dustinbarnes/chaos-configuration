import { Repository } from '../db/repository';
import { ConfigValue } from '../model';
import { Logger } from '../logger';

export async function loadData(repo: Repository) {
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

    try {
        await repo.set(i18n.namespace, i18n.key, i18n);
        await repo.set(objectConfig.namespace, objectConfig.key, objectConfig);
    } catch (e) {
        Logger.getInstance().error(e);
        throw e;
    }
}
