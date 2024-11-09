const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const sql = require('mssql');

app.use(cors());
app.use(bodyparser.json());

let conn = null;

const initMySQL = async () => {
    conn = await sql.connect({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    });
};

const createTable = `
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'users'
    )
    BEGIN
        CREATE TABLE users (
            userId INT PRIMARY KEY IDENTITY(1,1),
            username VARCHAR(255) NOT NULL
        );
    END

    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'requestFormData'
    )
    BEGIN
        CREATE TABLE requestFormData (
            requestFormId INT PRIMARY KEY IDENTITY(1,1),
            userId INT,
            type VARCHAR(255),
            details NVARCHAR(MAX),
            CHECK (ISJSON(details) = 1), 
            FOREIGN KEY (userId) REFERENCES users(userId)
        );
    END
`;

app.post('/user', async (req, res) => {
    try {
        const user = req.body;
        var result = await conn.request()
            .input('username', sql.VarChar, user.studentId)
            .query('SELECT * FROM users WHERE username = @username');

        if (result.recordset.length === 0) {
            result = await conn.request()
                .input('username', sql.VarChar, user.studentId)
                .query('INSERT INTO users (username) VALUES (@username)');
        }

        res.json({
            message: "Login success"
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

app.get('/user/:userId', async (req, res) => {

});

app.post('/user/:userId', async (req, res) => {
    try {
        const requestDetails = req.body;
        const id = req.params.userId;

        const result = await conn.request()
            .input('userId', sql.Int, id)
            .input('type', sql.VarChar, requestDetails.type)
            .input('details', sql.NVarChar, JSON.stringify(requestDetails.details))
            .query('INSERT INTO requestFormData (userId, type, details) VALUES (@userId, @type, @details)');

        res.json({
            message: 'Insert success',
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
})

app.put('/user/:requestFormId', async (req, res) => {
    try {
        const updateDetails = req.body;
        const id = req.params.requestFormId;

        const result = await conn.request()
        .input('requestFormId', sql.Int, id)
        .input('details', sql.NVarChar, JSON.stringify(updateDetails.details))
        .query('UPDATE requestFormData SET details = @details WHERE requestFormId = @requestFormId');

        res.json({
            message: 'Update success'
        });      
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

app.delete('/user/:requestFormId', async (req, res) => {

});

app.listen(8000, async (req, res) => {
    await initMySQL();
    await conn.request().query(createTable);
    console.log('http server runing at ' + 8000);
});