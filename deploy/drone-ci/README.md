## Deploy Drone CI

Prerequisites:

1. [Ansible](http://docs.ansible.com/ansible/intro_installation.html)
2. Ubuntu 16.04 server & ssh access to that server

Installation steps:

1. Update server ip in `hosts` file. If you are planning to use same server for both drone and nginx - just put same ip for both, drone & nginx targets.
2. Install Ansible role dependencies with one command: `./bin/install-ansible-dependencies.sh`
3. Update github application callback url to either point to your server ip address or your domain. For example:
`http://ci.myapp.com/authorize` or just `http://server_ip/authorize`.
4. Set server ip variable or domain name in `vars/main.yml` (`nginx_drone_server_name` variable).
5. Update `drone_admins` in `vars/main.yml` - a comma separated list of github users, who will be able to access your continuous integration server.
6. Rename `credentials-template.yml` into `credentials.yml` and update your github clientId, clientSecret as well as username and password for PostgreSQL database.

Once you done all above, run the following command:

```
./bin/setup-server.sh && ./bin/deploy-drone.sh
```

You should have Drone CI installed by now. The only step remaining is to make Drone work behind Nginx proxy.

### Setting up Nginx for Drone CI

If you would like to install nginx on a same server with Drone CI - just run following command:

```
./bin/setup-nginx.sh
```

If you already have nginx installed somewhere else and just would like to attach drone nginx configuration to existing nginx server you can do following:

1. Set nginx server ip in `hosts` file for the nginx target
2. Run same command `./bin/setup-nginx.sh`, but reply `no` to the question about nginx installation.

In this case nginx configuration for Drone CI will be copied to the existing nginx server.


### Setting up ssl for production Drone CI

1. Place your ssl keys into int ssl-keys directory as app.crt and app.key (they are in a `.gitignore`)
2. Make sure that `server_setup_ssl` is set to true in `vars/main.yml`
3. Deploy ssl using `./bin/setup-server.sh --tags "nginx"`
4. Update callback url in the Github application to start from `https`