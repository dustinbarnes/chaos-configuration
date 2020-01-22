import { testDbInit } from '../../test/helpers/test-database';

export async function loadData() {
    return testDbInit();
}
