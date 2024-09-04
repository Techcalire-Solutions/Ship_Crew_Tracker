const Ships = require('../ships/models/ship');
const Rank = require('../employees/models/rank');

async function dataInitialization() {
    const ships = [
        { shipName: 'INS DHRUV', shipCode: 'DHRUV', noOfEmployees: 400 }
    ];

    try {
        const ship = await Ships.find();  
        if (ship.length === 0) {   
            await Ships.insertMany(ships);  // Use await instead of callback
        }
    } catch (err) {
        console.error('Error during data initialization:', err);
    }

    const ranks = [
        {rankName: 'Lieutenant'}, {rankName: 'Captain'}, {rankName: 'Commander'}, {rankName: 'Commodore'}
    ]
    try {
        const rank = await Rank.find();
        if(rank.length === 0) {
            await Rank.insertMany(ranks); // Use await instead of callback
        }
    } catch (error) {
        console.error('Error during data initialization:', err);
    }
}

module.exports = dataInitialization;
