const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

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
      console.log('name or number missing')
      const errorDataMissing = {error:'name & number are both required'}
      res.status(400).json(errorDataMissing).end()
    }
  
    else if (persons.filter(person => person.name === addedPerson.name).length !== 0) {
      console.log('person already exists')
      const errorExists = {error:`the person ${addedPerson.name} already exists in contacts`}
      res.status(400).json(errorExists).end()
    }

    else {
      addedPerson['id'] = Math.floor(Math.random() * 99999);
      console.log('Added person: ', addedPerson)
      persons = [...persons].concat(addedPerson)
      res.json(persons)
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
      console.log('There were no matching person ids')
      res.status(404).end()
    } 
    else {
      console.log('persons before delete: ', persons)
      persons = persons.filter(person => person.id !== id)
      console.log('persons after delete: ', persons)
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})