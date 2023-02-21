require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')


const app = express()

morgan.token('bodyJSON', req => JSON.stringify(req.body || {}));

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyJSON'))
app.use(cors())
app.use(express.static('build'))



app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
    mongoose.connection.close()
  })
})

app.post('/api/persons', (req, res) => {
    let addedPerson = req.body

    if (!addedPerson.name || !addedPerson.number) {
      const errorDataMissing = {error:'name & number are both required'}
      res.status(400).json(errorDataMissing).end()
    }
  
    else if (persons.filter(person => person.name === addedPerson.name).length !== 0) {
      const errorExists = {error:`the person ${addedPerson.name} already exists in contacts`}
      res.status(400).json(errorExists).end()
    }

    else {
      addedPerson['id'] = Math.floor(Math.random() * 99999999)
      persons = [...persons].concat(addedPerson)
      res.json(addedPerson)
    }
})

app.get('/api/persons/:id', (req, res) => {
  const searchId = req.params.id
  Person.findById(searchId)
        .then(data => {
          if (data.length === 0) {
            res.status(404).end()
          }
          else {
            res.json(data)
          }
        })
        .catch(error => {
          res.status(400).json(error).end()
        })
    mongoose.connection.close()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  if (persons.filter(person => person.id === id).length === 0) {
    const errorNoMatch = {error:'no matching person ids'}
    res.status(404).json(errorNoMatch).end()
  } 
  else {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
    }
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const contactAmount = persons.length
    const date = new Date();
    res.send(`Phonebook has contact details of ${contactAmount} persons <br> ${date}`)
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})