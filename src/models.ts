import { Logger } from './logger'
import * as pino from 'pino';
import { inspect } from 'util';

export class ConfigEntry {
    constructor(public value: any, public criteria: Map<string, string>) {}

    static fromJsonToList(blob: any): ConfigEntry[] {
        let list: [any] = blob;
        if (!Array.isArray(blob)) {
            list = [blob];
        }

        return list.map((raw: any) => {
            return ConfigEntry.fromJson(raw);
        });
    }

    static fromJson(blob: any): ConfigEntry {
        const value = blob.value;
        const criteria: Map<string, string> = new Map(Object.entries(blob.criteria));
    
        return new ConfigEntry(value, criteria);
    }

    toJson(): object {
        // convert criteria map to standard js object literal
        let obj = [...this.criteria.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {});

        return {
            value: this.value,
            criteria: obj
        }
    }
}

export class ConfigItem {
    constructor(public base: any, public specifics: ConfigEntry[]) {}

    static fromJson(blob: any) {
        return new ConfigItem(blob.base, ConfigEntry.fromJsonToList(blob.specifics));
    }

    toJson(): object {
        return {
            base: this.base,
            specifics: this.specifics.map(e => e.toJson())
        }
    }
}

export interface Arbiter {
    arbitrate(items: ConfigEntry[], criteria: Map<string, string>): ConfigEntry;
}

class DefaultArbiter {
    arbitrate(items: ConfigEntry[], criteria: Map<string, string>): ConfigEntry {
        // In this default arbiter, most-specific-match wins first
        // So first we find the largest item size

        // For some reason, we can't guarantee that an actual map is coming for the item entry criteria.
        // Likely some bug to fix
        const topRanked = Math.max(...items.map(e => e.criteria.size));

        const matches = items.filter(it => it.criteria.size === topRanked);

        if (matches.length === 0) {
            throw new Error("Arbiter removed all matches -- probably an error in code");
        }

        if (matches.length > 1) {
            Logger.getInstance().warn(`Still have multiple matches after specificity ranking: ${inspect(matches, false, 4)}`);
        }

        return matches[0];
    }
}

export const defaultArbiter: Arbiter = new DefaultArbiter();

// The evaluators determine whether or not the specific item could be considered a match, as well as the count of fields that matched
export interface Evaluator {
    (item: ConfigItem, criteria: Map<string, string>): ConfigEntry[]
}

export function defaultEvaluator(item: ConfigItem, criteria: Map<string, string>): ConfigEntry[] {
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

export class ConfigValue {
    constructor(
        public namespace: string, 
        public key: string, 
        public value: ConfigItem) {}

    static fromJson(blob: any) {
        return new ConfigValue(blob.namespace, blob.key, ConfigItem.fromJson(blob.value));
    }

    toJson(): object {
        return {
            namespace: this.namespace,
            key: this.key,
            value: this.value.toJson()
        }
    }

    evaluate(criteria: Map<string, string>, evaluator: Evaluator = defaultEvaluator, arbiter: Arbiter = defaultArbiter): any {
        const evaluated = evaluator(this.value, criteria);

        if (!evaluated || evaluated.length <= 0) {
            return this.value.base;
        } else if (evaluated.length === 1) {
            return evaluated[0].value;
        } else {
            // defer to arbitrator
            return arbiter.arbitrate(evaluated, criteria).value;
        }
    }
}
