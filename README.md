# chaos-configuration

A criteria-based application configuration engine.
(this is just notes as of now)

# Inspiration

- https://github.com/hapipal/confidence
- https://github.com/microbean/microbean-configuration 
- https://unleash.github.io/ 

# UI Inspiration

- https://unleash.github.io/
- https://marmelab.com/react-admin/
- https://akveo.github.io/ngx-admin/
- https://github.com/coreui/coreui-free-bootstrap-admin-template

# Key Principles

- User can specify the different criteria that identify a configuration value
- Users of the service can send as many or as few coordinates/criteria as they wish
- For the requested config key, choose maximally specific coordinate/criteria match
- Try to stay out of deployment concerns, exist as a small docker container

# Developer Bullshit

To minimize the entropy of a config system, it needs to be as easy as possible to (1) set a global default value, and (2) be concise and specific in the overrides. Too often, the overrides for variations on a piece of software sit inside something like a puppet file, or spread across multiple files corresponding to multiple environments, regions, availability zones, and more. This makes your configuration extremely difficult to manage when your teams hit some arbitrary scale. In most config systems, you need to look at all the files to find your configuration gaps. Instead, this software is meant to store the configuration metadata, default value, and specific overrides, all in one object. 


# Other Things

- Applications are like namespaces
- Ideally just a key/value store for persisitence

# Configuration Example Cases

An example of internationalization (i18n) configuration:

```json
"checkout-app": {
  "greeting": {
    "default": "smack dab in the middle",
    "specifics": [
      { 
        "value": "center",
        "criteria": {
          "region": "us",
          "lang": "en"
        }
      },{
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
"streamprocessor": {
  "ratelimitconfig": {
    "default": {
      "size": 20,
      "refillRate": 300,
      "refillSize": 20
    },
    "specifics": [
      { 
        "value": {
          "size": 500,
          "refillRate": 1,
          "refillSize": 3
        },
        "criteria": {
          "customerId": "really-big-customer"
        }
      },{
        "value": {
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
"analytics": {
  "mysql": {
    "default": "mysql-a.example.com",
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
"analytics": {
  "mysql": {
    "default": "mysql-a.example.com",
    "specifics": [
      { 
        "value": "mysql-b.example.com",
        "criteria": {
          "accountId": "big-customer-id-1"
        }
      },{
        "value": "mysql-c.example.com",
        "criteria": {
          "zone": "apac-1"
        }
      }
    ]
  }
}         
```

The question then becomes: what happens if I'm in `apac-1` and also with accountId `big-customer-id-1`? Both of those are exact matches and both satisfy all criteria of the request. So which one do we pick? We can't choose that. That's got to be a customizable aspect of the system. We will provide some sort of conflict-resolution interface for teams to plug in their own methods. Default would probably be an order-based comparator in the array, such that `big-customer-id-1` would win in this case. Additional resolution methods might include some criteria being more important (like, `accountId` out-ranks `zone`), but this will obviously be use-case specific. 

