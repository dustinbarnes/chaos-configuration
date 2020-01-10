import { ConfigItem } from '../model';
import { Evaluator, DefaultEvaluator } from '../evaluator';
import { Arbiter, DefaultArbiter } from '../arbiter';

export interface Resolver {
    resolve(value: ConfigItem, criteria: Map<string, string>): any;
}

export class DefaultResolver {
    constructor(public evaluator: Evaluator = new DefaultEvaluator(), 
                public arbiter: Arbiter = new DefaultArbiter()) {}

    resolve(value: ConfigItem, criteria: Map<string, string>): any {
        const evaluated = this.evaluator.evaluate(value, criteria);

        if (!evaluated || evaluated.length <= 0) {
            return value.base;
        } else if (evaluated.length === 1) {
            return evaluated[0].value;
        } else {
            // defer to arbitrator
            return this.arbiter.arbitrate(evaluated, criteria).value;
        }
    }
}