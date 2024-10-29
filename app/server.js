const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

let db;

function connectWithRetry() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados. Tentando novamente em 5 segundos...');
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Conectado ao banco de dados MySQL');
      
      db.query(
        `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`,
        (err) => {
          if (err) throw err;
          console.log("Tabela 'people' verificada/criada com sucesso.");
        }
      );
    }
  });
}

connectWithRetry();

app.get('/', (req, res) => {
  const name = 'Full Cycle';
  const queryInsert = `INSERT INTO people (name) VALUES ('${name}')`;

  db.query(queryInsert, (err) => {
    if (err) throw err;

    const querySelect = `SELECT name FROM people`;
    db.query(querySelect, (err, results) => {
      if (err) throw err;

      const names = results.map((row) => `<li>${row.name}</li>`).join('');
      res.send(`<h1>Full Cycle Rocks!</h1><ul>${names}</ul>`);
    });
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
