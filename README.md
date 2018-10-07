# Portfolio Management

## Installation

You need to have NodeJS and MongoDB to run this application.

To install the dependencies of the project:
```sh
$ npm install
```

## Dev Setup

- nodemon
- jest

# API Documentation


|:-----------:|:------------------------------:|:--------------------------------------------------------------:|:-------:|:--------------:|
|     GET     |      /api/baseportfolios/      |         Returns all portfolios that the client can get         |         |                |
|     GET     |    /api/baseportfolios/<id>    |         Returns the baseportfolio specified by the <id>        |         |                |
|     POST    |      /api/baseportfolios/      |                    Adds a new baseportfolio                    |         |                |
|     PUT     |    /api/baseportfolios/<id>    |                Modifies a current baseportfolio                |         |                |
|    DELETE   |    /api/baseportfolios/<id>    |                 Delete a current baseportfolio                 |         |                |
|             |                                |                                                                |         |                |
|     GET     |         /api/portfolios        |      Returns the portfolios that the client currently has      |         |                |
|     GET     |      /api/portfolios/<id>      |          Returns the portfolio specified with the <id>         |         |                |
|     POST    |        /api/portfolios/        | Client can get a new portfolio that replicates a baseportfolio |         |                |
|     PUT     |      /api/portfolios/<id>      |                          Not supported                         |         |                |
|    DELETE   |      /api/portfolios/<id>      |           Delete the portfolio specified by the <id>           |         |                |
|     GET     |  /api/portfolios/<id>/holdings |        Retruns the holdings for the specified portfolio        |         |                |
|     GET     |  /api/portfolios/<id>/returns  |                          Not supported                         |         |                |
|             |                                |                                                                |         |                |
|     GET     |          /api/stocks/          |            Returns all stocks that the app supports            |         |                |
|     GET     |       /api/stocks/<name>       |       Returns the details of stock specified by the <id>       |         |                |
|     POST    |          /api/stocks/          |                        Add a new stock                         |         |                |
|     PUT     |       /api/stocks/<name>       |                     Modify a current stock                     |         |                |
|    DELETE   |       /api/stocks/<name>       |                     Delete a current stock                     |         |                |
|             |                                |                                                                |         |                |
|     GET     |    /api/trades/<portfolioId>   |        Get all trades inside the portfolio of the client       |         |                |
|     GET     | /api/trades/<portfolioId>/<id> |  Get details of the specified trade in the specified portfolio |         |                |
|     POST    |    /api/trades/<portfolioId>   |                 Add a new trade to a portfolio                 |         |                |
|     PUT     | /api/trades/<portfolioId>/<id> |        Modify a current trade in the specified portfolio       |         |                |
|    DELETE   | /api/trades/<portfolioId>/<id> |        Delete a current trade in the specified portfolio       |         |                |


