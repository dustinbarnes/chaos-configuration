import { ConfigItem, ConfigEntry } from './model';

export interface Evaluator {
    evaluate(item: ConfigItem, criteria: Map<string, string>): ConfigEntry[];
}

export class DefaultEvaluator {
    evaluate(item: ConfigItem, criteria: Map<string, string>): ConfigEntry[] {
        let evaluated: ConfigEntry[] = [];

        item.specifics && item.specifics.forEach((entry: ConfigEntry) => {
            let matches = [...entry.criteria.keys()].filter((key: string) => {
                const value = entry.criteria.get(key);
                return criteria.has(key) && criteria.get(key) === value;
            });

            if (matches.length === entry.criteria.size) {
                evaluated.push(entry);
            }
        });

        return evaluated;
    }
}
