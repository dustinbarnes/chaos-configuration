import { Router } from 'express';
import { AdminController } from './controller/admin-api';
import { ClientController } from './controller/client-api';
import { HealthController } from './controller/health';
import { Application } from 'express';

export function buildRoutes(app: Application) {
    if (!app) {
        throw new Error(`app is undefined: ${app}`);
    }

    const healthRouter = Router();
    const healthController = new HealthController();
    healthRouter.get('/', healthController.get);

    const adminRouter = Router();
    const adminController = new AdminController(app);
    adminRouter.get('/:namespace/:key', adminController.get);
    adminRouter.get('/populate-test-data', adminController.populateTestData);

    const clientRouter = Router();
    const clientController = new ClientController(app);
    clientRouter.get('/:namespace/_all', clientController.getAll)
    clientRouter.get('/:namespace/:key', clientController.get);
    
    return {
        healthRouter,
        adminRouter,
        clientRouter
    }
}
