const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('bodyJSON', req => JSON.stringify(req.body || {}));

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyJSON'))
app.use(cors())
app.use(express.static('build'))

let persons = [
          {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
          },
          {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
          },
          {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
          },
          {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
          },
          {
            "name": "Mary Poppendieckjjj",
            "number": "39-23-6423122",
            "id": 5         
          },
          {
            "name": "Ketale Poppendieck",
            "number": "39-23-6423122",
            "id": 6
          },
          {
            "name": "Karri Poppendieck",
            "number": "39-23-6423122",
            "id": 7
          }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
      addedPerson['id'] = Math.floor(Math.random() * 99999)
      persons = [...persons].concat(addedPerson)
      res.json(addedPerson)
    }
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personData = persons.find(person =>
       person.id === id
    )
    
    if (!personData) {
        res.status(404).end()
    }

    res.json(personData)
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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})