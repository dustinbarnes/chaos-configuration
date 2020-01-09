import { ConfigEntry, ConfigItem } from '../models';

export interface Evaluator {
    evaluate(item: ConfigItem, suppliedCriteria: Map<string, string>): ConfigEntry[];
}
