
if (process.argv.length < 3) {
    console.log("usage: node mongo.js <password> <name> <phone> - to add an entry \nnode mongo.js.<password> - to list all")
    process.exit(1)
}

const password = process.argv[2]

let mode 
let addName 
let addNumber

if (process.argv.length === 3) {
    mode = "get"
} 

if (process.argv.length === 5) {
    mode = "add"
    addName = process.argv[3]
    addNumber = process.argv[4]    
}

if (mode === undefined) {
    console.log("usage: node mongo.js <password> <name> <phone> - to add an entry \nnode mongo.js.<password> - to list all")
    console.log('invalid number of command line parameters')
    process.exit(1)
}

const mongoose = require('mongoose')

const url = `mongodb+srv://fullstackdev:${password}@fullstackdev.tzwqcse.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

phonebookSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', phonebookSchema)

if (mode === "get") {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}

if (mode === "add") {
    const person = new Person({
        name: addName,
        number: addNumber     
    })
    person.save().then(result => {
        console.log(`added ${addName} ${addNumber} to phonebook`)
        mongoose.connection.close()
    })
}

