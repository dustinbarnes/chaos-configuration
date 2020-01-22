
export type AuthToken = {
    accessToken: string,
    kind: string
};

export interface User {
    username?: string;
  
    active?: boolean;
  
    activationToken?: string;
    activationExpires?: Date;
  
    tokens?: AuthToken[];
}

const roles = [
    "admin",      // site-wide admin
    "owner",      // owner of a namespace - reader & writer & granter
    "writer",     // can write to its namespace
    "reader"      // can query values only
]

/*
export class ConfigEntry {
    constructor(public value: any, public criteria: Map<string, string>) {}

    static fromJsonToList(blob: any): ConfigEntry[] {
        let list: object[] = blob;
        
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
}
*/
