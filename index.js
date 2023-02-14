const express = require('express')
const app = express()
const PORT = 3001

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
              "name": "Henri Poppendieck",
            "number": "00-23-6423122",
            "id": 4
          }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personData = persons.find(person => {
        return person.id === id
    })

    if (!personData) {
        res.status(400).end
    }
       
    res.json(personData)
  })

app.get('/info', (req, res) => {
    const contactAmount = persons.length
    const date = new Date();

    res.send(`Phonebook has contact details of ${contactAmount} persons <br> ${date}`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})