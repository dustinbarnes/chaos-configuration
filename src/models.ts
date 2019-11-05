import { Logger } from './logger'
import * as pino from 'pino';
import { inspect } from 'util';

export class ConfigEntry {
    constructor(public value: any, public criteria: object) {}

    static fromJsonToList(blob: any): ConfigEntry[] {
        let list: [any] = blob;
        if (!Array.isArray(blob)) {
            list = [blob];
        }

        return list.map((raw: any) => new ConfigEntry(raw.value, raw.criteria));
    }
}

export class ConfigItem {
    constructor(public base: any, public specifics: ConfigEntry[]) {}

    static fromJson(blob: any) {
        return new ConfigItem(blob.base, ConfigEntry.fromJsonToList(blob.specifics));
    }
}

export interface Arbiter {
    (items: ConfigEntry[], criteria: Map<string, string>): ConfigEntry
}

export function defaultArbiter(items: ConfigEntry[], criteria: Map<string, string>): ConfigEntry {
    // By default, most-specific-match wins first
    let ranked = items
            .map((entry: ConfigEntry) => {
                return {"entry": entry, matches: Object.keys(entry.criteria).length };
            })
            .sort((a, b) => b.matches - a.matches);

    const max = ranked[0].matches;
    
    let matches = ranked
            .filter((item) => item.matches === max)
            .map((item) => item.entry);

    if (matches.length != 1) {
        Logger.getInstance().warn(`Still have multiple matches after specificity ranking: ${inspect(matches, false, 4)}`);
    }

    return matches[0];
}

export class ConfigValue {
    private static logger: pino.Logger = Logger.getInstance();

    constructor(public namespace: string, public key: string, public value: ConfigItem) {}

    static fromJson(blob: any) {
        return new ConfigValue(blob.namespace, blob.key, ConfigItem.fromJson(blob.value));
    }

    evaluate(criteria: Map<string, string>, arbiter: Arbiter = defaultArbiter): any {
        let evaluated = [];
        if (this.value.specifics) {
            evaluated = this.value.specifics
                .filter((entry: ConfigEntry) => {
                    let matches = Object.keys(entry.criteria).filter((key: string) => {
                        const value = entry.criteria[key];
                        return criteria.has(key) && criteria.get(key) === value;
                    });

                    return (matches.length === Object.keys(entry.criteria).length);
                });
        }

        if (!evaluated || evaluated.length <= 0) {
            return this.value.base;
        } else if (evaluated.length === 1) {
            return evaluated[0].value;
        } else {
            return arbiter(evaluated, criteria).value;
        }
    }
}
