require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const { response } = require('express')

const app = express()

morgan.token('bodyJSON', req => JSON.stringify(req.body || {}));

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyJSON'))
app.use(cors())


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  newPerson.save()
            .then(person => {
              res.json(person)
            })
            .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
  const searchId = req.params.id
  Person.findById(searchId)
        .then(data => {
          if (!data) {
            res.status(404).end()
          }
          else {
            res.json(data)
          }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next)  => {
  Person.findByIdAndDelete(req.params.id)
        .then(deletedPerson => {
          if (!deletedPerson) {
            res.status(404).json({'error':'no matching person ids'}).end()
          }
          else {
            console.log(`deleted ${deletedPerson} from database`)
            res.status(204).end()
          }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const searchId = req.params.id
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  if (!newPerson.name || !newPerson.number) {
    res.status(400).json({error:'name & number are both required'}).end()
  }

  Person.findByIdAndUpdate(searchId, {number:newPerson.number}, {runValidators: true, context: 'query'})
        .then(data => {
          if (data.length === 0) {
            res.status(404).end()
          }
          else {
            console.log(`updated ${newPerson.name} number to ${newPerson.number}`)
          res.status(204).end()
          }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const date = new Date();
  Person.find({})
        .then(personData => {
          res.send(`Phonebook has contact details of ${personData.length} persons <br> ${date}`)
        })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})