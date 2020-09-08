const ejs = require('ejs'),
    fs = require('fs'),
    mysql = require('mysql'),
    createCsvWriter = require('csv-writer').createObjectCsvWriter;

const mySqlClient = mysql.createConnection(require('../config/db_config'));

function download_csv(req, res) {
    var selectSql = 'select * from defact';
    const file = `${__dirname}/../temp/defact-list.csv`;

    mySqlClient.query(selectSql, function (err, data, fields) {
        if (err) throw err;

        const jsonData = JSON.parse(JSON.stringify(data));

        const csvWriter = createCsvWriter({
            path: __dirname + "/../temp/defact-list.csv",
            header: [
                {
                    id: "id",
                    title: "id"
                },
                {
                    id: "construction_name",
                    title: "공사명"
                },
                {
                    id: "construction_type",
                    title: "공종"
                },
                {
                    id: "dong",
                    title: "동"
                },
                {
                    id: "ho",
                    title: "호"
                },
                {
                    id: "room",
                    title: "위치"
                },
                {
                    id: "info",
                    title: "하자내용"
                },
                {
                    id: "create_date",
                    title: "등록일"
                },
                {
                    id: "due_date",
                    title: "기한"
                },
                {
                    id: "is_solved",
                    title: "보수완료여부"
                },
                {
                    id: "is_reject",
                    title: "해결여부"
                },
                {
                    id: "img",
                    title: "이미지경로"
                }]
        });
        writeCSV(csvWriter, jsonData, function () {
            res.download(file, '전체-하자리스트.csv', function (err) {
                if (err) {
                    res.json({
                        err: err
                    });
                    return;
                } else {
                    res.end();
                    return;
                }
            });
        });
    });
}

function prependBOM(file) {
    let fileContents = fs.readFileSync(file);
    fs.writeFileSync(file, "\ufeff" + fileContents);
}

async function writeCSV(csvWriter, jsonData, callback) {
    await csvWriter.writeRecords(jsonData);
    prependBOM(__dirname + "/../temp/defact-list.csv");
    callback();
}

module.exports.toCsv = download_csv;
