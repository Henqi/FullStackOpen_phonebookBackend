const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@cluster0.ckhr1zl.mongodb.net/?retryWrites=true&w=majority`

if (process.argv.length < 3) {
    console.log('Provide a password argument for db connection!')
    process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)


if (process.argv.length === 3) {
  console.log('3 arguments received!')

  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })

}

else if (process.argv.length === 5) {
    console.log('5 arguments received!')
    const personName = process.argv[3]
    const personNumber = process.argv[4]

    const person = new Person({
        name: personName,
        number: personNumber
    })
    
    person.save().then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook!`)
      mongoose.connection.close()
    })
  }
