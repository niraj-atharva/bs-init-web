# Device APIs

> TODO : Authentication related details will be shared soon.

### 1. Register Device

POST {{base_url}}/device_api/devices

OR To find an device

POST {{base_url}}/device_api/devices/find

Request payload :
```
{
    "device":{
        "name": "A50",
        "version": "Pro",
        "version_id": "1213",
        "manufacturer": "Samsung",
        "base_os": "android",
        "brand": "Samsung",
        "device_type": "mobile",
        "serial_number": "334455123123"
    }
}

```

Example Response :
```
200 Ok
{
    "id": 3,
    "available": true,
    "base_os": "android",
    "brand": "Samsung",
    "device_type": "mobile",
    "manufacturer": "Samsung",
    "meta_details": null,
    "name": "A50",
    "serial_number": "334455123123",
    "specifications": null,
    "version": "Pro",
    "assignee": null,
    "company": {
        "id": 1,
        "name": "Saeloun India Pvt. Ltd",
        "address": "somewhere in India",
        "business_phone": "+91 0000000000",
        "base_currency": "INR",
        "standard_price": "100000.0",
        "fiscal_year_end": "apr-mar",
        "date_format": "DD-MM-YYYY",
        "country": "IN",
        "timezone": "Asia - Kolkata",
        "created_at": "2022-05-26T07:21:17.559Z",
        "updated_at": "2022-05-26T07:23:48.907Z"
    },
    user: null,
    "version_id": "1213"
}
```

### 2. Update availability for device : On/Off

PUT {{url}}/device_api/devices/3/update_availability

Request data :
```
{
    "device":{
        "available": false
    }
}
```

Example Response :
```
200 Ok
{
    "success": true,
    "device": {
        "available": false,
        "id": 3,
        "user_id": 1,
        "company_id": 1,
        "device_type": "mobile",
        "name": "A50",
        "serial_number": "334455123123",
        "specifications": null,
        "created_at": "2022-08-23T07:33:38.723Z",
        "updated_at": "2022-08-23T07:34:54.476Z",
        "assignee_id": 2,
        "version": "Pro",
        "version_id": "1213",
        "brand": "Samsung",
        "manufacturer": "Samsung",
        "base_os": "android",
        "meta_details": null
    },
    "notice": "Changes saved successfully"
}
```

### 3. Approve Device Usages

PUT {{base_url}}/device_api/devices/:id/device_usages/approve

Example Response :
```
200 Ok
{
    "id": 4,
    "device": {
        "id": 3,
        "user_id": 1,
        "company_id": 1,
        "device_type": "mobile",
        "name": "A50",
        "serial_number": "334455123123",
        "specifications": null,
        "created_at": "2022-08-23T07:33:38.723Z",
        "updated_at": "2022-08-23T07:34:54.476Z",
        "assignee_id": 2,
        "available": true,
        "version": "Pro",
        "version_id": "1213",
        "brand": "Samsung",
        "manufacturer": "Samsung",
        "base_os": "android",
        "meta_details": null
    },
    "assignee": {
        "id": 2,
        "first_name": "Supriya",
        "last_name": "Agarwal",
        "email": "supriya@example.com",
        "created_at": "2022-05-26T07:23:49.487Z",
        "updated_at": "2022-05-26T07:34:26.621Z",
        "current_workspace_id": 1,
        "discarded_at": null,
        "personal_email_id": null,
        "date_of_birth": null,
        "social_accounts": null,
        "department_id": null,
        "phone": null
    },
    "created_by": null,
    "approve": true
}
```

### 5. Generate Device Usage Request [WEB]

POST {{base_url}}/device_api/devices/:id/device_usages

Request data :
```
{
    "device_usage":{
        "device_id": {{device_id}},
        "assignee_id": 1,
        "created_by_id": 7
    }
}
```

Example Response :
```
200 Ok
{
    "id": 1,
    "device": {
        "assignee_id": 1,
        "available": false,
        "id": 15,
        "user_id": null,
        "company_id": 1,
        "device_type": "mobile",
        "name": "A50",
        "serial_number": "334455123123",
        "specifications": null,
        "created_at": "2022-08-31T11:51:09.867Z",
        "updated_at": "2022-08-31T12:25:27.230Z",
        "version": "Pro",
        "version_id": "1213",
        "brand": "Samsung",
        "manufacturer": "Samsung",
        "base_os": "android",
        "meta_details": null
    },
    "assignee": {
        "id": 1,
        "first_name": "TEST",
        "last_name": "TEST",
        "email": "expertdev10@gmail.com",
        "created_at": "2022-08-02T13:49:13.680Z",
        "updated_at": "2022-08-26T15:03:17.407Z",
        "current_workspace_id": 1,
        "discarded_at": null,
        "department_id": null,
        "personal_email_id": null,
        "date_of_birth": null,
        "social_accounts": {
            "github_url": "",
            "linkedin_url": ""
        },
        "phone": null,
        "engage_code": 4,
        "engage_updated_by_id": 2,
        "engage_updated_at": "2022-08-26T15:03:17.401Z",
        "team_lead": false,
        "xteam_member_ids": [],
        "color": "17534a"
    },
    "created_by": {
        "id": 7,
        "first_name": "TEST",
        "last_name": "TEST",
        "email": "expertdev1011@gmail.com",
        "created_at": "2022-08-16T13:40:18.009Z",
        "updated_at": "2022-08-26T14:15:01.884Z",
        "current_workspace_id": 1,
        "discarded_at": null,
        "department_id": null,
        "personal_email_id": null,
        "date_of_birth": null,
        "social_accounts": {
            "github_url": "",
            "linkedin_url": ""
        },
        "phone": null,
        "engage_code": 3,
        "engage_updated_by_id": 2,
        "engage_updated_at": "2022-08-24T07:46:41.986Z",
        "team_lead": false,
        "xteam_member_ids": [],
        "color": "b87334"
    },
    "approve": true
}
```
