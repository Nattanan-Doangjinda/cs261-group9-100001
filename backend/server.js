const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const sql = require('mssql');

app.use(cors());
app.use(bodyparser.json());

let conn = null;

/*
    user: 'sa',
    password: 'YourStrong@Passw0rd',
    server: 'localhost',
    database: 'myDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
*/
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
            status NVARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            type NVARCHAR(255) NOT NULL,
            details NVARCHAR(MAX),
            CHECK (ISJSON(details) = 1), 
            FOREIGN KEY (userId) REFERENCES users(userId)
        );
    END
`;

// เก็บข้อมูล user ลง database
app.post('/user', async (req, res) => {
    try {
        const user = req.body;
        var result = await conn.request()
            .input('username', sql.VarChar, user.studentId)
            .query('SELECT * FROM users WHERE username = @username');

        if (result.recordset.length === 0) {
            await conn.request()
                .input('username', sql.VarChar, user.studentId)
                .query('INSERT INTO users (username) VALUES (@username)');

            result = await conn.request()
                .input('username', sql.VarChar, user.studentId)
                .query('SELECT * FROM users WHERE username = @username');
        }

        res.json({
            message: "Login success",
            userId: result.recordset[0].userId
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

// เอาข้อมูลคำร้องจาก database
app.get('/user/published/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await conn.request()
            .input('state', sql.VarChar, 'Published')
            .input('userId', sql.Int, userId)
            .query('SELECT type, requestFormId, status FROM requestFormData WHERE userId = @userId AND state = @state');

        res.json(result.recordset);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

// ส่งข้อมูลคำร้องไปเก็บ database
app.post('/user/:userId', async (req, res) => {
    try {
        const requestDetails = req.body;
        const id = req.params.userId;

        const result = await conn.request()
            .input('userId', sql.Int, id)
            .input('status', sql.NVarChar, requestDetails.status)
            .input('state', sql.VarChar, requestDetails.state)
            .input('type', sql.NVarChar, requestDetails.type)
            .input('details', sql.NVarChar, JSON.stringify(requestDetails.details))
            .query('INSERT INTO requestFormData (status, state, userId, type, details) VALUES (@status, @state, @userId, @type, @details)');

        res.json({
            message: 'Insert success',
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
})

// update ข้อมูลคำร้อง
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

// ลบข้อมูลคำร้อง
app.delete('/user/:requestFormId', async (req, res) => {
    try {
        const requestFormId = req.params.requestFormId;
        const result = await conn.request()
            .input('requestFormId', sql.Int, requestFormId)
            .query('DELETE FROM requestFormData WHERE requestFormId = @requestFormId');
        res.json({ message: 'DELETE success' });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

// เอาข้อมูลคำร้อง
app.get('/user/request/:requestFormId', async (req, res) => {
    try {
        const id = req.params.requestFormId;

        const result = await conn.request()
            .input('requestFormId', sql.Int, id)
            .query('SELECT * FROM requestFormData WHERE requestFormId = @requestFormId');

        result.recordset[0].details = JSON.parse(result.recordset[0].details);

        res.json(result.recordset[0]);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

// เอาข้อมูลคำร้อง draft จาก database
app.get('/user/draft/:userId', async (req, res) => {
    try {
        const data = []
        const userId = req.params.userId;
        const result = await conn.request()
            .input('state', sql.VarChar, 'Draft')
            .input('userId', sql.Int, userId)
            .query('SELECT type, requestFormId, details FROM requestFormData WHERE userId = @userId AND state = @state');

        for (var i = 0; i < result.recordset.length; i++) {
            const response = {
                type: result.recordset[i].type,
                requestFormId: result.recordset[i].requestFormId,
                date: JSON.parse(result.recordset[i].details).date
            }

            data.push(response);
        }

        res.json(data);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

app.listen(8000, async (req, res) => {
    await initMySQL();
    await conn.request().query(createTable);
    console.log('http server runing at ' + 8000);
});