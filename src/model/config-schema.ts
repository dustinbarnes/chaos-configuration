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
        const entries: [string, string][] = Object.entries(blob.criteria);
        const criteria = new Map(entries);

        // console.log(`eol - ${criteria.size}`);
        // for (let [k, v] of criteria.entries()) {
        //     console.log(`${k} = ${v}`);
        // }
        // console.log(`eol2 - ${criteria.size}`);

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
        public id: number,
        public namespace: string, 
        public key: string, 
        public value: ConfigItem,
        public version: number) {}

    static fromJson(blob: any) {
        if (blob === undefined) {
            throw new Error("blob was undefined");
        }
        return new ConfigValue(
            blob.id || null, 
            blob.namespace, 
            blob.key, 
            ConfigItem.fromJson(blob.config_value_json), 
            blob.version || 0);
    }

    toJson(): object {
        return {
            id: this.id,
            namespace: this.namespace,
            key: this.key,
            config_value_json: this.value.toJson(),
            version: this.version 
        }
    }
}
