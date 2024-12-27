const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
//const queryDatabase = require('./util/queryDatabase');
console.log('Starting the server...');
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.get('/', async (req, resp)=>{
    console.log("we are good");
    const sql = 'SELECT * FROM users';
    //const db_result = await queryDatabase(sql, 'renti');
    resp.send(`We are good, this is the db result: ${JSON.stringify(db_result)}`);
})

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on http://localhost:${PORT}`);
});
