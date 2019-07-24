### Setting up Github OAuth application

The first step to do is to go to the [Github](https://github.com/settings/applications/new) and register new OAuth application. If you want to try [install drone on the local machine](local/README.md) just use `http://localhost:8000/login` as `Authorization callback URL`. For the production environment replace `http://localhost:8000` with your domain name or just use ip address.

Once registered, you should have:
1. Github client id
2. Github client secret

You will need them for both, production and local drone versions.