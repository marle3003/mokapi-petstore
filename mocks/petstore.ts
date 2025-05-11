import { on, every } from 'mokapi';
import { produce } from 'mokapi/kafka';

const pets = [
    {
        id: 1,
        name: 'Yoda',
        category: 'dog'
    },
    {
        id: 2,
        name: 'Rex',
        category: 'dog'
    },
    {
        id: 3,
        name: 'Nugget',
        category: 'canary'
    }
];
const orders = [
    {
        id: 1,
        petId: 1,
        status: 'placed',
        placed: {
            timestamp: new Date().toISOString()
        }
    },
    {
        id: 2,
        petId: 2,
        status: 'accepted',
        shipDate: new Date(Date.now() + 26*60*60*1000).toISOString(),
        placed: {
            timestamp: new Date(Date.now() - 60*60*1000).toISOString()
        },
        accepted: {
            timestamp: new Date().toISOString()
        }
    },
    {
        id: 3,
        petId: 3,
        status: 'completed',
        shipDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
        placed: {
            timestamp: new Date(Date.now() - 2.5*60*60*1000).toISOString()
        },
        accepted: {
            timestamp: new Date(Date.now() - 1.5*60*60*1000).toISOString()
        },
        completed: {
            timestamp: new Date().toISOString()
        }
    }
]

export default () => {
    on('http', (request, response) => {
        if (request.query.category) {
            response.data = pets.filter(pet => pet.category === request.query.category)
        } else {
            response.data = pets
        }
        return true;
    });

    let index = 0;
    every('30s', () => {
        console.log('producing new random Kafka message')
        produce({ 
            topic: 'petstore.order-event',
            messages: [
                {
                    key: orders[index].id,
                    data: orders[index],
                }
            ]
        });
        index++;
    }, { times: orders.length });
}