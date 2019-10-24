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
