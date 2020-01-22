const values = {
    "configValues": [
        {
            "namespace": "default",
            "key": "middle-i18n",
            "config_value_json": {
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
        },
        {
            "namespace": "default",
            "key": "specificity-host",
            "config_value_json": {
                "base": "base",
                "specifics": [
                    { 
                        "value": "custid-only",
                        "criteria": {
                            "customerId": "really-big-customer"
                        }
                    },
                    {
                        "value": "us-bronze",
                        "criteria": {
                            "region": "us",
                            "accountType": "bronze"
                        }
                    }
                ]
            }
        }
    ]
};

export default values;
