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

# Other Things

- Applications are like namespaces
- Ideally just a key/value store for persisitence

```json
application.key = {
  default: value,
  specific: [
    { 
      value: "center",
      criteria: {
        "region": "us",
        "lang": "en"
      }
    },{
      value: "centre",
      criteria: {
        "region": "uk",
        "lang": "en"
      }
    }
  ]
}         
```

In this way, the system can be used for value internationalization, feature flag implementations, and in general, a configuration system that exists as both hierarchical and criteria-based specifications.

However, internationalization is not the primary/only use case. Take the case of configuring customer rate limiting:

```json
streamprocessor.ratelimitconfig = {
  default: {
    size: 20,
    refillRate: 300,
    refillSize: 20
  },
  specific: [
    { 
      value: {
        size: 500,
        refillRate: 1,
        refillSize: 3
      },
      criteria: {
        customerId: "really-big-customer"
      }
    },{
      value: default: {
        size: 3,
        refillRate: 1,
        refillSize: 1
      },
      criteria: {
        region: "us",
        accountType: "beta"
      }
    }
  ]
}         
```

This allows us to override (or specify) values depending on a number of non-hierarchical constraints. 
