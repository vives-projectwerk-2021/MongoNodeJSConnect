const {MongoClient} = require ('mongodb');
const { consumers } = require('stream');

async function main(){
    // this uri can be found in the MongoDB Atlas under "connect" and then "connect you application" (remember to change "<password>" to actual password)
    const uri ="mongodb+srv://AaronVanV:M0ng0dAar0n@aaronvanv.ocujk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client =new MongoClient(uri);

    try{
        await client.connect();

        //call functions

        //await listDataBases(client);

        /* await createListing(client,{
            name: "Lovely Loft",
            summary: "A charming",
            bedrooms: 1,
            bathrooms: 1
        }) */

        await createMultipleListings(client,[
            {
                name: "Infinite Views",
                summary: "Modern home with infinite views from the infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
            {
                name: "Beautiful Beach House",
                summary: "Enjoy relaxed beach living in this house with a private beach",
                bedrooms: 4,
                bathrooms: 2.5,
                beds: 7,
                last_review: new Date()
            }
        ])

    }catch(e){
        console.error(e);
    }finally{
        await client.close();
    }
}

main().catch(console.error);


//functions

//READ

//shows list of all database on account
async function listDataBases(client){
    databasesList = await client.db().admin().listDatabases();
    
    console.log("DB:");
    databasesList.databases.forEach(db=>{
        console.log(`- ${db.name}`);
    })
}

//CREATE

//creates a (1) new set of data into a certain DB 
async function createListing(client,newListing){
    result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`New listing created with the following id : ${result.insertedId}`);

}

//creates multiple sets of data into a certain DB
async function createMultipleListings(client,newListings){
    result= await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listings created with following id(s): ;`);
    console.log(result.insertedIds)
}


