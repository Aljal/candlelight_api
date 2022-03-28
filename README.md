# candlelight_api

## Set up:
This project uses a Postgresql database to store data, so we need to instal it.
The configuration for this project has been made on Linux therefore, all the instructions in this file will be valid for Linux users.

### Install Postgresl and create the database
1. Install postgresl command line utility: `sudo apt-get install pgsql`
2. Create the database named *candlelignt* and the role *dbuser* to use it:
>**OPTIONAL:** you don't need it if you are a postgres superuser: `sudo -u postgres`
  - Create the new role *dbuser*, don't forget the password we'll need it later: `createuser --interactive --pwprompt dbuser`
  - Create the database *candlelight* and assign it to the *dbuser* role:  `createdb candlelight -O dbuser`

### Install Node js and npm
`sudo apt-get install node`

### Create a .env file
This project uses *dotenv* to handle the environnement variables, thus we need to create a *.env* file to run this project.
The *.env* file needs to contain the following data:
```
HOST=localhost
PORT=8080

PGHOST=localhost
PGPORT=5432
PGUSER=dbuser
PGDATABASE=candlelight
PGPASSWORD=<the dbuser password provided at the previous step>
```
HOST and PORT defines the host and port for the express library used by our Node js server.
The rest of the variable stand to connect to our database *candlelight* using our *dbuser* role with credential for security purpose.
Feel free to change HOST, PORT, PGHOST or PGPORT. But for the rest of this file we will be using the same value.

### Create tables and populate it
This project contains db script in node to populate the database, here are the steps to use it:
1. Install the dependencies: `npm i`
2. Run the initialization script: `node db/init.js`
3. Populate the database: `node db/populate.js`


## Run and test the entire project
Now that we completed all the set up, the project is ready to be run from the beginning to the end.

### Run the project
Use node to run the project: `node server.js`

### Test it
To test our project, you will need to use Postman, you can install it here: https://www.postman.com/downloads/
Alternatively you can develop a whole front end project to test it.

#### Test the users routes

##### Create a user and login
We will first create a user using the route */user*: `POST /api/users` with the following data:
```
{
  first_name: "John",
  last_name: "Doe",
  email: "test@test.te",
  phone: "+33605040302",
  birthday: "1990-01-01",
  password: "azerty123"
}
```
- Now we created a user we can login to get a JWT: `POST /api/users/login` with the following data:
```
{
  email: "test@test.te",
  password: "azerty123"
}
```
- If the user does not exist an HTTP error 404 is returned with the message *User not found*.
- In case of wrong credentials an HTTP error 403 is returned with the message *Wrong password*.

##### Request the products
Request the product added in the database by the populate.js scrip:
`GET /api/products`
