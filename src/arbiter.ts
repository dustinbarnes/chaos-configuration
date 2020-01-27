import { ConfigEntry } from './model'

export interface Arbiter {
    arbitrate(items: ConfigEntry[], suppliedCriteria: Map<string, string>): ConfigEntry;
}

export class RankingArbiter implements Arbiter {
    constructor(private fieldMapping: Map<string, number> = new Map()) {}
    
    getCriteriaRank(name: string): number {
        if (this.fieldMapping.has(name)) {
            return this.fieldMapping.get(name);
        } else {
            this.fieldMapping.set(name, 1);
            return 1;
        }
    }

    arbitrate(items: ConfigEntry[], criteria: Map<string, string>): ConfigEntry {
        // In this ranking arbiter, we assign a point value to each field name
        // See the above getCriteriaRank() method
        const sortedCandidates = items.sort((a, b) => {
            const aValue = [...a.criteria.keys()]
                .map(key => this.getCriteriaRank(key))
                .reduce((prev, current) => prev + current, 0)

            const bValue = [...b.criteria.keys()]
                .map(key => this.getCriteriaRank(key))
                .reduce((prev, current) => prev + current, 0)

            return bValue - aValue;
        });

        return sortedCandidates[0];
    }
}

export class DefaultArbiter extends RankingArbiter {
    getCriteriaRank(name: string): number {
        // In the default arbiter, every field has a score of 1. 

        // Instead of going through the `if` checks, instead 
        // just hardcode the knowledge
        return 1;
    }
}

