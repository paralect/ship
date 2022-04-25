# .NET Product Development Roadmap

This repository is a central repository for Paralect .NET technological movement. .NET is a huge part of the Paralect history. In fact, for the first 5 years of the company .NET was a primary technology for most of the projects. We love technology and beleive it suits very well for what we do: product engineering.

Whenever Paralect starts new product development it has few strategical advantages. Our primary focus is to help to client be successful, therefore we focus feature development from a first day to make sure business has every feature it needs to grow. Growth results into successful product. Successful products allow us to become better engineers and do what we love. 

 Feel free to share your ideas using [issues](https://github.com/paralect/dotnet-api-starter/issues/new).

## Our goals

1. We can efficiently start new products development. Our ideal time target of `environment configuration` task is 4 hours.
2. We want to reuse a lot of existing work from Node.JS based projects and keep .NET only as business logic heart of the application.

### Environment configuration tasks

This is list of the environment configuration work we do quickly during the first day for any new client:

- Repository setup
- Project architecture setup. Here we should already propose how we work with database, how we exchange data between client and server, how we transmit validation errors. The point here is to do as much routine work upfront as possible, so we can be more efficient during product development.
- SPA architecture setup
- Continous Integration pipeline
- Deployment automation
- Servers setup for staging environment

### Things we can reuse from Node.JS products

Our initial idea is to reuse everything except REST api. Things we use for Node.js products described very well in [Ship repository](https://github.com/paralect/ship)

1. [Landing site](https://github.com/paralect/nextjs-landing-starter)
2. [React.JS SPA](https://github.com/paralect/koa-react-starter) (and simple Node.JS server to server index.html file and static assets)
3. [Deployment automation](https://github.com/paralect/ship/tree/master/deploy/app) with Docker & Ansible. 
4. [CI automation](https://github.com/paralect/ship/tree/master/deploy/drone-ci) using Drone CI (we might use other CI if this won't work)
5. [.NET project srtart via single command](https://github.com/paralect/docker-compose-starter). We plan to use self-hosted API service to being able to run it within Docker. 

## How to set it up

In order to make Paralct.Ship work with this API server on Windows some changes in files are needed to be made.

1. docker-compose.yml:
	- Add named volume "mongodata" (This will allow to save data even if container is removed)
	- For mongo service replace "- /var/run/docker.sock:/var/run/docker.sock" with "- mongodata:/data/db" (The path /var/run/docker.sock does not exist on Windows)
	- Remove api service entirely (.Net API server starts separately)
	- Add mongodata volume declaration like "db-data" volume here:
	https://docs.docker.com/compose/compose-file/#endpoint_mode

2. web/src/server/config/environment/development.js:
	- Change jwt secret setting to "jwt_secret128bits" (in .Net it needs to be more than 127 bist long)


To run API service inside docker container api/src/docker-compose.yml file is used. To run the rest of services top level docker-compose.yml file is used. So to run Ship you'll have to run "docker-compose up" twice.