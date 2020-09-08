//FOR SERVER

module.exports = {
  connectionLimit: 30,
  host: process.env.DATABASE_HOST,
  user: "root",
  password: "",
  database: "bluecheckdb",
  dateStrings: "date",
  charset: "utf8",
  debug: false,
  insecureAuth: true,
};

////FOR LOCAL TEST
//module.exports = {
//    connectionLimit: 20,
//    host: 'localhost',
//    user: 'root',
//    password: 'q1w2e3r4',
//    database: 'bestwaydb',
//    dateStrings: 'date',
//    charset  : 'utf8',
//    debug: false,
//    insecureAuth: true
//}
