//FOR SERVER
module.exports = {
  connectionLimit: 30,
  host: process.env.DATABASE_HOST,
  user: "root",
  password: "abVg3hK",
  database: "bluecheckdb",
  dateStrings: "date",
  charset: "utf8",
  debug: false,
  insecureAuth: true,
};

//FOR LOCAL TEST
//module.exports = {
//    connectionLimit: 20,
//    host: 'localhost',

//    user: 'root',
//    password: 'wjswls1',
//    database: 'bestwaydb',
//    dateStrings: 'date',
//    debug: false
//};
