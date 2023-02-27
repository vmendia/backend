const express = require('express')
const logger = require('morgan')

const app = express()
app.use(express.json())

logger.token('body', (req,res) => req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '' )

const logFormat = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}
app.use(logger(logFormat))

app.use(express.static('build'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {

    response.json(persons)
})

app.get('/info', (request, response) => {
    const timestamp = Date()
    // console.log(`Received request - ${request.method} ${request.url}`)

    response.send(
        `Phonebook has info for ${persons.length} people
        <br/><br/>${timestamp}`
    )
})

app.get('/api/persons/:id', (request, response) => {
    // console.log(`Received request - ${request.method} ${request.url}`)

    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id)
    if (person) {
        response.json(person)
    }
    else {
       response.status(404).json( {
        error: `Person with id ${request.params.id} not found` 
       }) 
    }
})

app.delete('/api/persons/:id', (request, response) => {
    // console.log(`Received request - ${request.method} ${request.url}`)

    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id)
    if (person) {
        persons = persons.filter( p => p.id !== id)
        response.status(200).json({ status: `person with id ${id} deleted !` })
    }
    else {
       response.status(404).json( {
        error: `Person with id ${request.params.id} not found` 
       }) 
    }
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const updatedPerson = request.body

    const person = persons.find( p => p.id === id)

    if ( (updatedPerson.name === undefined) || (updatedPerson.name.trim().length === 0) ) {
        return response.status(400).json( { error: 'name is required'})
    } 

    if ( (updatedPerson.number === undefined) || (updatedPerson.number.trim().length === 0) ) {
        return response.status(400).json( { error: 'number is required'})
    } 

    const name = updatedPerson.name.trim().toLowerCase()

    if ( persons.find( p => p.name.trim().toLowerCase() === updatedPerson.name && p.id !== id) !== undefined) {
         return response.status(400).json( { error: 'name must be unique'})
    } 

    persons = persons.filter( p => p.id !== id)
    updatedPerson.id = id
    persons.push(updatedPerson)
    response.status(200).json(updatedPerson)

})

app.post('/api/persons', (request, response) => {
    // console.log(`Received request - ${request.method} ${request.url}`)

    const person = request.body

    if ( (person.name === undefined) || (person.name.trim().length === 0) ) {
        return response.status(400).json( { error: 'name is required'})
    } 

    if ( (person.number === undefined) || (person.number.trim().length === 0) ) {
        return response.status(400).json( { error: 'number is required'})
    } 

    const name = person.name.trim().toLowerCase()

    if ( persons.find( p => p.name.trim().toLowerCase() === name ) !== undefined) {
         return response.status(400).json( { error: 'name must be unique'})
    } 


    do {
        id = Math.floor(Math.random() * 10000)
    } while (persons.find( p => p.id === id ) !==  undefined) 

    person.id = id;

    persons.push(person)
    response.status(200).json(person)
})

// check environment value first
const PORT =  process.env.PORT | 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
