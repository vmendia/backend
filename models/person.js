const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to: ', url)

mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB: ', error.message))

phonebookSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return ( /\d{2,3}-\d{6,}/.test(v) || /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(v) )
            },
            message: error => `phone is not a valid phone number! - format [#]##-###### or [(]###[)] ###-####`
          },
        required: true,
        minLength: 8
    }
})

phonebookSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
})

module.exports = mongoose.model('Person', phonebookSchema)
