// import { Permission } from './permissions';

export class Namespace {
    name: string;
}

export class ConfigDimension {
    name: string;
    description: string;
    // potentially: validationRegex
    // potentially:
}

export class ConfigEntry {
    value: any;
    criteria: [Criteria];
}

export class Criteria {
    name: string;
    value: any;
}

export class ConfigValue {
    namespace: Namespace;
    key: string;
    value: any;
    specifics: ConfigEntry;
}
//
// export class User {
//     private name: string;
//     private email: string;
//     private permissions: [Permission];
//
//     constructor(name, email, permissions) {
//         this.name = name;
//         this.email = email;
//         this.permissions = permissions;
//     }
// }
