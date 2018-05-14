## Deploy grafana and influxdb

Below we describe in details how to:

1. Install [Grafana](https://github.com/grafana/grafana)
2. Install [InfluxDb](https://github.com/influxdata/influxdb), which is used as datasourse with Grafana
3. Install [Telegraf](https://github.com/influxdata/telegraf) to collect server metrics.

*If you plan to use Grafana monitoring for your product feel free to copy this repository to your project and change variables as needed.*

### Requirements

Deployment to remote server is done using [Ansible](https://www.ansible.com/) - a simple automation tool. Deployment was tested on a brand new Digital Ocean Ubuntu 16.04 server. Some changes might required to run other linux distributives. Deployment steps includes:

1. Docker installation
2. Installation of [Grafana](https://github.com/grafana/grafana), [InfluxDb](https://github.com/influxdata/influxdb) and [Telegraf](https://github.com/influxdata/telegraf)
3. Running Grafana, InfluxDb, Telegraf inside Docker containers

### Prerequisites:

1. [Ansible](http://docs.ansible.com/ansible/intro_installation.html)
2. Ubuntu 16.04 server & ssh access to that server

## Installation steps

For Grafana installation [paralect.grafana](https://galaxy.ansible.com/paralect/grafana/) Ansible role is used.

1. Update hosts file
  - ```monitoring``` is ip of the server where you are planing to deploy grafana
  - ```server``` is ip of server where you application is located, used with telegraf
2. Install Ansible role dependencies with one command: `./bin/install-ansible-dependencies.sh`
3. Rename `credentials-template.yml` into `credentials.yml` and update the following variables:
  - `gf_admin_user` - username for admin user. You need it to login to the grafana.
  - `gf_admin_password` - a password for admin user. You need it to login to the grafana.
  - `postgres_user` - username for admin user for PostgreSQL. Grafana uses PostgreSQL to store data.
  - `postgres_password` - password for admin user for PostgreSQL.
  - `influx_admin_user` - influxDB admin username.
  - `influx_admin_password` - influxDB admin password.
  - `influx_user` - influxDB username of the user with read and write permissions. Telegraf uses this user.
  - `influx_user_password` - influxDB password of the user with read and write permissions
  - `influx_read_user` - influxDB username of the user with read permissions. Grafana uses this user.
  - `influx_read_user_password` - influxDB password of the user with read permissions.
4. Update variables in the `main.yml` file
  - `app_name` - application name. Used in nginx
  - `hostname` - field `host` in telegraf data
  - `gf_domain` - domain name for grafana
  - `postgres_db_name` - PostgreSQL database name
  - `data_source_name` - name of the storage backends for your time series data (Data Source)
  - `influx_db_name` - influx database name
  - `mongo_connection` - mongo connection string, used by telegraf to monitor count of operations. Examples:
    * mongodb://user:auth_key@10.10.3.30:27017
    * mongodb://10.10.3.33:18832
    * 10.0.0.1:10000
  - `redis_connection` - redis connection string, used by telegraf to monitor count of operations. Examples:
    * tcp://localhost:6379
    * tcp://:password@192.168.99.100
    * unix:///var/run/redis.sock

Once you done all above, run the following command:
```
./bin/setup-server.sh && ./bin/deploy-influxdb.sh && ./bin/deploy-grafana.sh ./bin/deploy-nginx.sh
```

### Setting up Telegraf to collect data

If you would like to install telegraf - just run following command:

```
./bin/deploy-telegraf.sh
```

### License

MIT
