// const Redis = require('ioredis');
// require('dotenv').config();


// // const client = redis.createClient({
// //     url: process.env.REDIS_URL,
// // });

// // client.connect()
// // .then(() => {
// //     console.log('connected to redis');
// // })
// // .catch(console.error)
// const client = new Redis(process.env.REDIS_URL)
// // await client.set('foo', 'bar')
//     if(client.connector.connecting === true){
//         console.log('connected to redis');
//     } else{
//         console.log('cann not cannected to redis');
        
//     }

// module.exports = client;