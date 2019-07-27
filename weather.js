'use strict';

var mysql = require('mysql');
var moment = require('moment');
var config = require('./config.json');
var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname,
});


module.exports.get_allweather = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err,connection){  
    if (err) throw err; // not connected!
    connection.query('select * from station_logs', function (error, results, fields) {
        connection.release();
        const response = {
          statusCode: 200,
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(results),
        };
        if (error) callback(error);
        else callback(null,response)
    });
  });
};


module.exports.log_weather = (event, context, callback) => {
  var data = JSON.parse(event.body);
  var station_id  = data.station_id;
  var air_temp = data.air_temp;
  var ground_temp = data.ground_temp;
  var ground_moisture = data.ground_moisture;
  var wind_speed = data.wind_speed;
  var wind_direction = data.wind_direction;
  var humidity = data.humidity;
  var date_added = moment(Date.now()).format();
  var insert_response = {success : false};
  
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err,connection){  
    if (err) throw err; // not connected!
    connection.query('insert into station_logs SET ?',
        {
          station_id: station_id,
          air_temp: air_temp,
          ground_temp: ground_temp,
          ground_moisture: ground_moisture,
          wind_speed: wind_speed,
          wind_direction: wind_direction,
          humidity: humidity,
          date_added: date_added
        }, function (error, results, fields) {
        connection.release();
        insert_response.success = true;
        const response = {
          statusCode: 200,
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(insert_response, null, 2),
        };
        if (error) callback(error);
        else callback(null,response)
    });
  });
};
