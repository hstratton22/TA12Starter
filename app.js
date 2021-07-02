//https://github.com/byui-cse/cse341-course/tree/master/docs/lesson12/prove-solution
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const app = express()

const liveChat = require('./routes/liveChat')

app.set('view engine', 'ejs')
    .set('views', 'views')
    .use(express.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static(path.join(__dirname, 'public')))
    .use(
        session({
            // Simple and not very secure session
            secret: 'random_text',
            cookie: {
                httpOnly: false // Permit access to client session
            }
        })
    )
    .use('/', liveChat)

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = require('socket.io')(server)
var users = [];
io.on('connection', socket => {
    console.log('Client connected!')

    socket
        .on('newUser', (username, time) => {
            // A new user logs in.
            // users.push({
            //     id: socket.id,
            //     username: username
            // });
            socket.username = username;
            const message = `${username} has logged on.`
            socket.broadcast.emit('newMessage', {
                /** CONTENT for the emit **/
                message,
                time,
                from: 'admin'
            })

        })
        .on('disconnect',
            () => {
                // const presentUser = users.find(user => user.id == socket.id);
                // console.log("present user", presentUser);
                
                // socket.broadcast.emit('newMessage', {
                //            message: presentUser.username + " has disconnected",
                //            time: 'now',
                //            from:'admin'
                //     })
                //users = users.filter(user => user != presentUser);
                console.log('A client disconnected!')
                //displays disconnect after login as well, why? can't access user after logged off
                //    console.log(socket.username);
                   const message =  "someone has disconnected";
                   socket.broadcast.emit('newMessage', {
                       message,
                       time: 'now',
                       from:'admin'
                })
                //     function () {
                //         var connectionMessage = //socket.username + " Disconnected from Socket ";
                //         "Someone disconnected";
                //         console.log(connectionMessage);
                // console.log('A client disconnected!')
                // socket.broadcast.emit('newMessage', {
                //     /** CONTENT for the emit **/
                //     connectionMessage,

                //     from: 'admin'
                // })
            })

        .on('message', data => {
            // Receive a new message
            console.log('Message received')
            console.log(data)
            socket.broadcast.emit('newMessage', {
                ...data
                /** CONTENT for the emit **/
            }) //  Note, only emits to all OTHER clients, not sender.
        })
})

// const path = require('path')
// const express = require('express')
// const bodyParser = require('body-parser')
// const session = require('express-session')

// const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

// const app = express()

// const liveChat = require('./routes/liveChat')

// app.set('view engine', 'ejs')
//     .set('views', 'views')
//     .use(express.json())
//     .use(bodyParser.urlencoded({ extended: true }))
//     .use(express.static(path.join(__dirname, 'public')))
//     .use(
//         session({
//             // Simple and not very secure session
//             secret: 'random_text',
//             cookie: {
//                 httpOnly: false // Permit access to client session
//             }
//         })
//     )
//     .use('/', liveChat)

// const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))

// const io = require('socket.io')(server)
// io.on('connection', socket => {
//     console.log('Client connected!')

//     socket
//         .on('disconnect', () => {
//             console.log('A client disconnected!')
//         })
//         .on('newUser', (username, time) => {
//             // A new user logs in.
//             const message = `${username} has logged on.`
//             // Tell other users someone has logged on.
//             socket.broadcast.emit('newMessage', {
//                 message,
//                 time,
//                 from: 'admin'
//             })
//         })
//         .on('message', data => {
//             // Receive a new message
//             console.log('Message received')
//             console.log(data)
//             // This one is simple. Just broadcast the data we received.
//             // We can use { ...data } to copy the data object.
//             socket.broadcast.emit('newMessage', {
//                 ...data
//             }) // Note, only emits to all OTHER clients, not sender.
//         })
// })