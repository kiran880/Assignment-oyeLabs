const mysql = require('mysql2')

const customers = [
  {
    email: 'anurag11@yopmail.com',
    name: 'anurag',
  },
  {
    email: 'sameer11@yopmail.com',
    name: 'sameer',
  },
  {
    email: 'ravi11@yopmail.com',
    name: 'ravi',
  },
  {
    email: 'akash11@yopmail.com',
    name: 'akash',
  },
  {
    email: 'anjali11@yopmail.com',
    name: 'anjai',
  },
  {
    email: 'santosh11@yopmail.com',
    name: 'santosh',
  },
]

const config = {
  host: 'your_host',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
}

const connection = mysql.createConnection(config)

function insertOrUpdateCustomers(customers) {
  customers.forEach(customer => {
    connection.query(
      'INSERT INTO customers (name, email) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?',
      [customer.name, customer.email, customer.name],
      (error, results) => {
        if (error) {
          console.error(error)
        }
      },
    )
  })
}

insertOrUpdateCustomers(customers)

connection.end()
