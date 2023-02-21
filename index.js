require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const { response } = require('express')

const app = express()

morgan.token('bodyJSON', req => JSON.stringify(req.body || {}));

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyJSON'))
app.use(cors())
app.use(express.static('build'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

    if (!newPerson.name || !newPerson.number) {
      const errorDataMissing = {error:'name & number are both required'}
      res.status(400).json(errorDataMissing).end()
    }
    else {
      newPerson.save()
                .then(person => {
                  res.json(person)
                 })
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
})

app.delete('/api/persons/:id', (req, res) => {
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
        .catch(error => {
          console.log(error)
          response.status(400).send({error: 'malformed id'})
        })
})

app.get('/info', (req, res) => {
  const date = new Date();
  Person.find({})
        .then(personData => {
          res.send(`Phonebook has contact details of ${personData.length} persons <br> ${date}`)
        })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})