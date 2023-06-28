const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
})

const app = express()

app.use(bodyParser.json())

app.post('/api/customers', (req, res) => {
  const {name, phoneNumber} = req.body

  if (!name || !phoneNumber) {
    return res.status(400).json({error: 'Name and phone number are required'})
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err)
      return res.status(500).json({error: 'Internal server error'})
    }

    connection.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err)
        return res.status(500).json({error: 'Internal server error'})
      }

      connection.query(
        'SELECT * FROM customers WHERE phone_number = ?',
        [phoneNumber],
        (err, results) => {
          if (err) {
            console.error('Error executing MySQL query:', err)
            connection.rollback(() => {
              connection.release()
            })
            return res.status(500).json({error: 'Internal server error'})
          }

          if (results.length > 0) {
            connection.rollback(() => {
              connection.release()
            })
            return res.status(409).json({error: 'Phone number already exists'})
          }

          connection.query(
            'INSERT INTO customers (name, phone_number) VALUES (?, ?)',
            [name, phoneNumber],
            err => {
              if (err) {
                console.error('Error executing MySQL query:', err)
                connection.rollback(() => {
                  connection.release()
                })
                return res.status(500).json({error: 'Internal server error'})
              }

              connection.commit(err => {
                if (err) {
                  console.error('Error committing transaction:', err)
                  connection.rollback(() => {
                    connection.release()
                  })
                  return res.status(500).json({error: 'Internal server error'})
                }

                connection.release()
                return res
                  .status(200)
                  .json({message: 'Customer added successfully'})
              })
            },
          )
        },
      )
    })
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
