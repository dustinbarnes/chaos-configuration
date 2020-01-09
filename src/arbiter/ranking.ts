import { Arbiter } from './base';
import { ConfigEntry } from '../models';

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

    arbitrate(items: ConfigEntry[], suppliedCriteria: Map<string, string>): ConfigEntry {
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