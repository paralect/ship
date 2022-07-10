---
sidebar_position: 99
---

# Retool


`Retool` - is the backoffice tool. Ship contains predefined Retool apps. To find more about Retool please visit the [official site](https://retool.com/).


## Installation guideline
1. If you don't have Retool account yet, [sign up](https://login.retool.com/auth/signup).

2. Import predefined Retool app. To import Retool app go to `Apps` > `Create New` > `From JSON`. Select the app from [retool directory](https://github.com/paralect/ship/tree/master/services/api-koa/src/config/retool). Give a name to your app.
Look at [Predefined Apps](#predifined-apps) section to see available apps.

![Import App](/img/api/retool/import-project.gif)

3. Attach resources to the Retool app. To use Retool queries you need to attach resources to them. Select the query. Click on `Resource` select input. Select an existing resource or create a new one. Look at [App Resources](#app-resources) section to see how to connect the resources needed.
![Update Resource](/img/api/retool/update-resources.gif)


4. Enjoy the result. Read [Retool docs](https://docs.retool.com/docs/home) for more.


## Predefined Apps
### Users Management App
Users Management App can be used for user administration. The main features of Users Management App are: 
* Users are displayed in the table. 
* It is possible to find a particular user.
* You can see the user's details and apply a set of actions to the user. Actions are: `Update`, `Remove`, `Verify Email`. 
![Add REST API](/img/api/retool/users-managment-table.png)

## App Resources 
This section helps you to connect the resources that are used by predefined Retool apps. 
### Koa REST API
To connect Koa REST API resource:
1. Select `REST API` resource
2. Give a name to the resource
3. Write `Base URL` of your server. For local development, you can generate URL by [ngrok](https://ngrok.com/)
4. Add `x-admin-key` header. The value for `x-admin-key` is stored in [koa app config](https://github.com/paralect/ship/blob/master/services/api-koa/src/config/environment/index.ts#L23).
![Add REST API](/img/api/retool/resources-add-rest-api.gif)
