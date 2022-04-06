# Esse4
A simpler but better looking esse3 (italian universities' portal), based on nodejs and mongodb (NoSQL).

![Esse4](screen.png?raw=true)

## How to use
The `package.json` scripts available are the following:

1. `npm run build` builds the whole application (client/server), but doesn't load seeder;
2. `npm run build-client` builds the client part;
3. `npm run build-server` builds the server part;
4. `npm run seeder` loads the initial content in the database;
5. `npm run serve` runs the web application.

To put online the server:
- be sure to have the `mongod` running;
- configure the `server/config.js` file;
- run `npm install` from the root folder;
- run `npm run seeder` to load inital dummy data inside the db;
- run `npm run build && npm run serve` to build the whole application and put online the server;
- go to `http://localhost:3000` and try to login with `123456/test` (simple user) or with `000000/test` (admin user).

## Notes
Tested and developed with `node v17.7.2`.