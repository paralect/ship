---
sidebar_position: 99
---

# Retool


[Retool](https://retool.com/) is a low-code instrument that allows building internal applications like admin panels remarkably fast. Check [Predefined Apps](#predefined-apps) to see which applications Ship already contains.


## Installation guideline
1. Create an account at [Retool](https://login.retool.com/auth/signup) or request an invite to the existing project. At the moment Retool doesn't allow users to have multiple projects. So keep in mind that it's impossible to use one account on different projects.

2. Import prebuilt applications from retool [folder](https://github.com/paralect/ship/tree/master/services/api-koa/src/config/retool) in Ship. Open `Apps` > ` Create New` > `From JSON` and choose needed.

![Import App](/img/api/retool/import-project.gif)

3. Attach resources(API or Database) for performing Retool queries: СRUD operations with data, HTTP requests, etc. Select the query, click on `Resource` and choose one. Look at the [App Resources](#app-resources) section to see how to connect different types of resources.

![Update Resource](/img/api/retool/update-resources.gif)


:::tip
	
	Learn how to build more with Retool [documentation](https://docs.retool.com/docs/home).
	
:::


## Predefined Apps
### Users Management App
The application is built for user administration, it can be extended and used as internal admin panel. The main features are:
* Users are displayed in the table. 
* You can find a particular user.
* You can see the user's details and apply a set of actions to the user. Default actions are: `Update`, `Remove`, `Verify Email`.
![Add REST API](/img/api/retool/users-managment-table.png)

## App Resources 
This section helps you to connect the resources that are used by predefined Retool apps. 
### REST API
To connect [**API**](/docs/api/overview) service: 
1. Select `REST API` resource
2. Give a name to the resource
3. Write `Base URL` of your server. For local development, you can generate URL by [ngrok](https://ngrok.com/)
4. Add `x-admin-key` header. The value for `x-admin-key` is stored [here](https://github.com/paralect/ship/blob/master/services/api-koa/src/config/environment/development.json) as `adminKey`.
![Add REST API](/img/api/retool/resources-add-rest-api.gif)
