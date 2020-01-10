import { ConfigEntry } from '../model';

export interface Arbiter {
    arbitrate(items: ConfigEntry[], suppliedCriteria: Map<string, string>): ConfigEntry;
}