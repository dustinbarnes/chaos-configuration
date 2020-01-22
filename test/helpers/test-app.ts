// process.env.NODE_ENV = 'test';

// const supertest = require('supertest');
// import { testDbInit } from './test-database';
// const getApp = require('../../../lib/app');

// const prepTestDb = require('./database-init');
// const getLogger = require('../../fixtures/no-logger');
// const StateService = require('../../../lib/state-service');

// const { EventEmitter } = require('events');
// const eventBus = new EventEmitter();

// function createApp(stores, adminAuthentication = 'none', preHook) {
//     return getApp({
//         stores,
//         eventBus,
//         preHook,
//         adminAuthentication,
//         secret: 'super-secret',
//         sessionAge: 4000,
//         stateService: new StateService({ stores, getLogger }),
//         getLogger,
//     });
// }


// export async function setupApp() {
//     const configStore = await testDbInit();
//     const app = createApp(stores);

//     return {
//         request: supertest.agent(app),
//         destroy: () => stores.db.destroy(),
//     };
// }