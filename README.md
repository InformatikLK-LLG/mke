# MKE

A system for managing the inventory of a local boat rental.

## What it does (what it will do in the future [hopefully])
- tbc.

## Set up development environment

### Requirements

- Java 16
- Node.js >=12.3.1
- npm >=7.11.1

### Set up environment variables

- `DB_USER=<username>`
- `DB_PASSWORD=<password>`
- `DB_HOSTNAME=<hostname>`
- `DB_PORT=<port>`
- `DB_NAME=<db_name>`

#### How to set up env variables

- **edit `.env` file in root folder**
- bash: `export NAME=value`
- windows: `setx NAME value /M`
- edit launch config in editor

### Install Stuff

- run `mvn package` in [server/](server/)
- run `npm install` in [web/](web/)

---

## Start Stuff

#### JAVA STUFF

- change working directory to [server/](server/)
- run java project
- `--server.port=port` specifies port on which server runs
- if nothing works => `mvn clean install`

#### REACT STUFF

- change working directory to [web/](web/)
- run `npm run start`
