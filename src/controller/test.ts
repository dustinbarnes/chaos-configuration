import { OK, SERVICE_UNAVAILABLE, NOT_FOUND } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Application, Response } from 'express';
import { RequestExt } from '../logger';
import { Repository } from '../db/repository';
import { ConfigValue } from '../models';
import { inspect } from 'util';

// This class is where I'm prototyping new ideas. Shouldn't be included in repo. 
@Controller('test')
export class TestController {

    constructor(private app: Application) {}

    @Get(':namespace/:key')
    public async get(req: RequestExt, res: Response): Promise<Response> {
        try {
            const repo: Repository = this.app.locals.repo;
            
            const namespace: string = req.params.namespace;
            const key: string = req.params.key;
            
            const result = await repo.get(namespace, key); 
            if (result) {
                return res.status(OK).json(result);
            } else {
                return res.status(NOT_FOUND).json('404 Not Found');
            }
        } catch (e) {
            req.log.error('Error', e);
            return res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD' });
        }
    }

    @Get('check')
    public async check(req: RequestExt, res: Response): Promise<Response> {
        try {
            const repo: Repository = this.app.locals.repo;
            const result = {};
            
            const intl: ConfigValue = ConfigValue.fromJson(await repo.get('default', 'middle-i18n'));
            
            const criteriaMap: Map<string, string> = new Map();

            criteriaMap.set('lang', 'es');
            criteriaMap.set('region', 'mx');
            result['intl_default'] = intl.evaluate(criteriaMap);

            criteriaMap.clear();
            criteriaMap.set('lang', 'en');
            criteriaMap.set('region', 'ca');
            result['intl_en_ca'] = intl.evaluate(criteriaMap);

            criteriaMap.clear();
            criteriaMap.set('lang', 'en');
            criteriaMap.set('region', 'us');
            result['intl_en_us'] = intl.evaluate(criteriaMap);

            criteriaMap.clear();
            criteriaMap.set('lang', 'en');
            criteriaMap.set('region', 'uk');
            result['intl_en_uk'] = intl.evaluate(criteriaMap);

            const obj = ConfigValue.fromJson(await repo.get('default', 'json-obj-example'));
            
            criteriaMap.clear();
            result['obj_empty'] = obj.evaluate(criteriaMap);

            criteriaMap.set('region', 'us');
            criteriaMap.set('customerId', 'really-big-customer');
            result['obj_cust'] = obj.evaluate(criteriaMap);

            criteriaMap.clear();
            criteriaMap.set('region', 'us');
            criteriaMap.set('accountType', 'bronze');
            result['obj_region'] = obj.evaluate(criteriaMap);

            criteriaMap.clear();
            criteriaMap.set('region', 'us');
            criteriaMap.set('accountType', 'bronze');
            criteriaMap.set('customerId', 'really-big-customer');
            result['obj_all'] = obj.evaluate(criteriaMap);

            return res.status(OK).json(result);
        } catch (e) {
            req.log.error('Error', e);
            return res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD', error: inspect(e) });
        }
    }

    @Get('populate')
    public async populate(req: RequestExt, res: Response) {
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

        const sqlConfig = ConfigValue.fromJson({
            "namespace": "default",
            "key": "sql-by-custid",
            "value": {
                "base": "mysql.example.com",
                "specifics": [
                    { 
                        "value": "mysql-big-customer-1.example.com",
                        "criteria": {
                            "accountId": "big-customer-id-1"
                        }
                    },{
                        "value": "mysql-big-customer-2.example.com",
                        "criteria": {
                            "accountId": "big-customer-id-2"
                        }
                    }
                ]
            }    
        });     

        try {
            const repo: Repository = this.app.locals.repo;

            await repo.set(i18n.namespace, i18n.key, i18n);
            await repo.set(objectConfig.namespace, objectConfig.key, objectConfig);
            await repo.set(sqlConfig.namespace, sqlConfig.key, sqlConfig);

            res.status(OK).json("done");
        } catch (e) {
            req.log.error('Error', e);
            res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD' });
        }
    }
}
