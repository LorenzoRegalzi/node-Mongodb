const { MongoClient } = require('mongodb');
//const db = db.env['LINKTOBD'];
const config = require('./env');

async function main() {
    
    const uri = config.LINKTOBD;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        
        //await listDatabases(client);

        // await createListing(client,{
        //     name: 'Hotel',
        //     summary: "description of test",
        //     bedrooms: 1,
        //     bathrooms: 1
        // })

        //  await createMultipleListing(client,[{
        //     name: 'HotelArray',
        //     summary: "description of test",
        //     bedrooms: 1,
        //     bathrooms: 1
        // },{
        //     name: 'HotelArray2',
        //     summary: "description of test",
        //     bedrooms: 1,
        //     bathrooms: 1
        // }])

        await findForName(client, 'Hotel')

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    
}

main().catch(console.error);

async function findListingsWithMinimumBathroomsandRecentReviews(client, bedNumber = 0, bathNumber = 0, maximunResult = 0){
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: { gte: bedNumber },
        bathrooms: { gte: bathNumber },       
    }).sort({ last_review: -1 })
    .limit(maximunResult);

    const results = await cursor.toArray();
}


async function findForName(client, nameOfElement){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfElement});

    console.log(result);
}



async function createMultipleListing(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListing);

    console.log(`New listings created : ${result.insertedCount}`);
}





async function createListing(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}