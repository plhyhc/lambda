# lambda

#### Summary
This is a prototype for using AWS Lambda for a RESTFUL API.  This example has two functions, one for retrieving all data and another for inserting new data.
The use case for this application is a weather station that would POST current readings for air temp, ground temp, wind direction, etc.  This information would be saved into a database.  

#### Pre-Requisites
You will need to have AWS CLI installed and configured.  You will also need Node.js installed on your local computer.

#### Installation
First clone the respository to your local computer.
Then run the following inside the directory to install dependencies:
```
npm install
```

#### Configure serverless.yml
In the serverless.yml file there are some settings need updating.  You may not need as many security groups or subnet. Update the following under provider:
```
  region: us-west-2
  stage: api
  role: <your role here>
  vpc:
    securityGroupIds:
      - <your group here>
      - <your group here>
    subnetIds:
      - <your subnet here>
      - <your subnet here>
      - <your subnet here>
```

#### AWS Configuration
This application connects to an RDS MySQL server.  You will need to update the security group and IAM to allow Lambda functions to access it.  The security group will need port access and the Lambda group will need access to the VPC the RDS is a part of.

#### Database Setup
For MySQL create the following table.
```
CREATE TABLE `station_logs` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `date_added` datetime DEFAULT NULL,
  `air_temp` double(15,9) DEFAULT NULL,
  `ground_temp` double(15,9) DEFAULT NULL,
  `ground_moisture` double(15,9) DEFAULT NULL,
  `wind_speed` double(15,9) DEFAULT NULL,
  `wind_direction` varchar(25) DEFAULT NULL,
  `humidity` double(15,9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER TABLE `station_logs`
  ADD PRIMARY KEY (`id`);
```

#### Deploy to AWS
Once configuration of serverless.yml and AWS is done you can deploy the functions to AWS Lambda.  To do so, in the directory of the code run the following command:
```
sls deploy
```
This process will take about 20 seconds or so and the functions will be available right away.  In the console output you should see the URL endpoints.

#### Usage
The function "get_allweather" will return a JSON object of all items in the table via GET HTTP Method.
The function "log_weather" is for inserting new rows.  This is down via POST HTTP Method.  Using the [RESTED Chrome plugin](https://chrome.google.com/webstore/detail/rested/eelcnbccaccipfolokglfhhmapdchbfg?hl=en-US) I was able to get the following to work.  Just make sure to replace the (INT), (FLOAT), (STRING) with actual values.  Here are the key/values to POST:
```
{
  "station_id": "(INT)",
  "air_temp": "(FLOAT)",
  "ground_temp": "(FLOAT)",
  "ground_moisture": "(FLOAT)",
  "wind_speed": "(FLOAT)",
  "wind_direction": "(STRING)",
  "humidity": "(FLOAT)"
}
```