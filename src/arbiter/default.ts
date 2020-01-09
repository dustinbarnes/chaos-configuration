import { RankingArbiter } from './ranking';

export class DefaultArbiter extends RankingArbiter {
    getCriteriaRank(name: string): number {
        // In the default arbiter, every field has a score of 1. 

        // Instead of going through the `if` checks, instead 
        // just hardcode the knowledge
        return 1;
    }
}