// read configuration info
require("dotenv").config()

const Person = require('./models/person')

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


app.get('/api/persons', (request, response) => {
    Person.find({})
        .then( persons => {
            response.json(persons) 
        })
        .catch(error => { 
            console.log('error:', error.message)
            response.status(404).end()
        })

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

    const id = request.params.id
    Person.findById(id)
        .then (person => {
            if (person === null) {
                response.status(404).json( {
                    result: `Person with id ${id} not found`
                }) 
            }
            else { response.json(person) }
        })
        .catch ( error => {
          response.status(404).json( {
            error: `error returned getting id ${id}: ${error.message}`
          }) 
        }) 
})


app.delete('/api/persons/:id', (request, response) => {

    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then (person => {
            if (person === null) {
                response.json({result: `Id ${id} not found in DB`})
            }
            else {
                response.json( {result: `Id ${id} removed`, person: person} )
            }
        })
        .catch ( error => {
          response.status(404).json( {
            error: `Person with id ${id} not found - error: ${error.message}`
          }) 
        }) 
})


app.put('/api/persons/:id', (request, response) => {
    
    const updatedPerson = request.body

    if ( (updatedPerson.name === undefined) || (updatedPerson.name.trim().length === 0) ) {
        return response.status(400).json( { error: 'name is required'})
    } 

    if ( (updatedPerson.number === undefined) || (updatedPerson.number.trim().length === 0) ) {
        return response.status(400).json( { error: 'number is required'})
    } 

    const id = request.params.id

    Person.findById(id)
        .then (person => {
            if (person === null) {
                response.status(404).json( {
                    result: `Person with id ${id} not found`
                }) 
            }
            else { 
                person.name = updatedPerson.name
                person.number = updatedPerson.number

                person.save()
                .then(result => {
                    console.log(`updated ${person.name} ${person.number} to phonebook`)
                    response.json(person)
                })
                .catch(error => {
                    console.log(`error updating phonebook entry - ${person.name} ${person.number} : error detail - ${error.message}`)
                    response.status(500)
                })
            }
        })
        .catch ( error => {
          response.status(404).json( {
            error: `error returned getting id ${id}: ${error.message}`
          }) 
        }) 



})


app.post('/api/persons', (request, response) => {
    // console.log(`Received request - ${request.method} ${request.url}`)

    const body = request.body

    if ( (body.name === undefined) || (body.name.trim().length === 0) ) {
        return response.status(400).json( { error: 'name is required'})
    } 

    if ( (body.number === undefined) || (body.number.trim().length === 0) ) {
        return response.status(400).json( { error: 'number is required'})
    } 


    const person = new Person({
        name: body.name,
        number: body.number     
    })

    person.save()
        .then(result => {
            console.log(`added ${body.name} ${body.number} to phonebook`)
            response.json(person)
        })
        .catch(error => {
            console.log(`error saving phonebook entry - ${body.name} ${body.number} : error detail - ${error.message}`)
            response.status(500)
        })
})


const PORT =  process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
