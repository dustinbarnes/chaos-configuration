# chaos-configuration

A criteria-based application configuration engine.

The goal of this project is not to be an application -- it's more like an application framework. Plug in your own details like auth, auditing, persistence, etc.

## Developer Details

1. Using TypeScript, and Yarn for dependencies.
2. Using OvernightJS for TypeScript+Express decorators for routing and controllers: https://github.com/seanpmaxwell/overnight/#overnight-core
3. Using Pino for logging 
4. This app's configuration is ONLY through environment variables. See `config.ts` for values for now.
5. Using the [keyv](https://www.npmjs.com/package/keyv) database abstraction.


To run: `npm run build && node build/run.js`.  

## Inspiration

- https://github.com/hapipal/confidence
- https://github.com/microbean/microbean-configuration 
- https://unleash.github.io/ 

## UI Inspiration

- https://unleash.github.io/
- https://marmelab.com/react-admin/
- https://akveo.github.io/ngx-admin/
- https://github.com/coreui/coreui-free-bootstrap-admin-template

## Key Principles

- User can specify the different criteria that identify a configuration value
- Try to stay out of deployment concerns, exist as a small docker container
- Resolution of which value to pick happens on client side -- keeps server fast and light
  - Simple RDBMS backing
  - Users of the service can send as many or as few coordinates/criteria as they wish
  - For the requested config key, choose maximally specific coordinate/criteria match
- Top-level namespaces independent of any other concept.
- Applications are a config dimension in a highly connected service-based system.
- Ideally just a key/value store for persistence

## Developer Bullshit

To minimize the entropy of a distributed system, it needs to be as easy as possible to (1) set a global default value, and (2) be concise and specific in the overrides. Too often, the overrides for variations on a piece of software are spread across multiple files corresponding to multiple environments, regions, availability zones, and more. This makes your configuration extremely difficult to manage when your teams hit some arbitrary scale. In most config systems, you need to look at all the files to find your configuration gaps. Instead, this software is meant to store the configuration metadata, default value, and specific overrides, all in one object.

## Configuration Example Cases

An example of internationalization (i18n) configuration:

```json
{
  "namespace": "default",
  "key": "middle-i18n",
  "value": {
    "base": "middle",
    "specifics": [
      {
          "value": "center",
          "criteria": {
            "region": "us",
            "lang": "en"
          }
      }, {
        "value": "centre",
        "criteria": {
          "region": "uk",
          "lang": "en"
        }
      }
    ]
  }
}
```

The case of configuring customer rate limiting:

```json
{
  "namespace": "default",
  "key": "json-obj-example",
  "value": {
    "base": {
      "type": "default",
      "size": 20,
      "refillRate": 300,
      "refillSize": 20
    },
    "specifics": [
      {
        "value": {
          "type": "custid-only",
          "size": 500,
          "refillRate": 1,
          "refillSize": 3
        },
        "criteria": {
          "customerId": "really-big-customer"
        }
      },{
        "value": {
          "type": "us-bronze",
          "size": 3,
          "refillRate": 1,
          "refillSize": 1
        },
        "criteria": {
          "region": "us",
          "accountType": "bronze"
        }
      }
    ]
  }
}
```

Note that this makes it very clear what the exceptions are. There's no confusion about "what about a us region and a silver customer?" It's right there. The cognitive complexity of this configuration has been dramatically reduced. 

This supports normal config stuff too, like database configs:

```json
{
  "namespace": "default",
  "key": "sql-by-custid",
  "value": {
    "base": "mysql.example.com",
    "specifics": [
      {
        "value": "mysql-big-customer-1.example.com",
        "criteria": {
           "accountId": "big-customer-id-1"
        }
      },{
        "value": "mysql-big-customer-2.example.com",
        "criteria": {
          "accountId": "big-customer-id-2"
        }
      }
    ]
  }
}
```

Storing the data this way means you can see exactly what the exceptional cases are. You can tell if the customizations are done per farm, per customer, per region, or any other factor you want. 

There is one gotcha in this whole arrangement: when more than one value is maximally specific. Take the previous example, with a small change:

```json
{
  "namespace": "default",
  "key": "sql-by-custid",
  "value": {
    "base": "mysql.example.com",
    "specifics": [
      {
        "value": "mysql-big-customer-1.example.com",
        "criteria": {
           "accountId": "big-customer-id-1"
        }
      },{
        "value": "mysql-big-customer-2.example.com",
        "criteria": {
          "zone": "apac-1"
        }
      }
    ]
  }
}
```

The question then becomes: what happens if I'm in `apac-1` and also with accountId `big-customer-id-1`? Both of those are exact matches and both satisfy all criteria of the request. So which one do we pick? We can't choose that. That's got to be a customizable aspect of the system. We call this Arbitratioin. By default, arbitration is done on matches with most criteria first, picking the first one in case of tied entries.

We will provide some sort of conflict-resolution interface for teams to plug in their own methods. Additional resolution methods might include some criteria being more important (like, `accountId` out-ranks `zone`), but this will obviously be use-case specific.
