# Portfolio Management

## Installation

You need to have NodeJS and MongoDB to run this application.

To install the dependencies of the project:
```sh
$ npm install
```

## Libraries/Frameworks

- `config` - Keeping dev/test/production environment
- `fawn` - Provides atomicity and rollback to DB transactions
- `joi` - Object Schema validation
- `joi-objectid` - Validation ObjectID support for Joi
- `winston` - Logger
- `express-async-errors` - An async/await support hack for ExpressJS


## Start

Make sure `mongod` is up and running.

To run the server:
```sh
$ node server.js
```

## Dev Setup

- nodemon
- jest (No tests currently written)

To run the server:
```sh
$ nodemon server.js
```

## API Documentation

[List of APIs](https://github.com/anurag-rai/portfolio-manager/wiki/API-Documentation)

## Idea

### Application

- The application will hold `basePortfolio` which will behave as a skeleton for the clinet `portfolio`.
- The application will hold `stocks` in it's DB. Currently implementatino provides a RESTful method of updating the `rate` of the stock. This can be changed later to dynamically poll an API in real-time or use any other suitable alternative. 
- Any change is the `basePortfolio` has to reflected in the `portfolios` of the clients who have bought/replicated this. Example: If a new stock is added to this portfolio, all clients who currently own this portfolio need to have that stock available to them in that portfolio.

### Client
- Clients can buy/get `portfolios`. This will be an exact copy of a `basPortfolio` i.e. same stocks.
- Clients can perform `trades`. The `trade` and `portfolio` are tightly-coupled. A `trade` has to happen inside a `portfolio` `stock`. The time of the trade will determine the rate of the stock.
- Clients can modify or delete a `trade`.
- Clients can view their current `portfolios` along with the `trades` made for `stocks` inside that `portfolio`.

### Functionality
- Clients can view their total `holding` for a given portfolio.
