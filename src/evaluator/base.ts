import { ConfigEntry, ConfigItem } from '../model';

export interface Evaluator {
    evaluate(item: ConfigItem, suppliedCriteria: Map<string, string>): ConfigEntry[];
}
