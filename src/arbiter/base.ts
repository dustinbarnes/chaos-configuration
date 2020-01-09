import { ConfigEntry } from '../models';

export interface Arbiter {
    arbitrate(items: ConfigEntry[], suppliedCriteria: Map<string, string>): ConfigEntry;
}