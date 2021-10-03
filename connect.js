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

        /* await createMultipleListings(client,[
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
        ]) */

        //await findListingByName(client,"Infinite Views");

        await findListingsWithMinimumBedroomBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBathrooms:4,
            minimumNumberOfBathrooms:2,
            maximumNumberOfResults:5
        });

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


//returns 1 matching document with the query (even if more documents match)
async function findListingByName(client, nameOfListing){
    result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name:nameOfListing})

    if (result){
        console.log(`Found a listing in collection with name '${nameOfListing}'`);
        console.log(result);
    }else{
        console.log(`No listings were found with name '${nameOfListing}'`);
    }
}

//return s all matching documents with the query
async function findListingsWithMinimumBedroomBathroomsAndMostRecentReviews(client,{
    minimumNumberOfBedrooms=0,
    minimumNumberOfBathrooms=0,
    maximumNumberOfResults=Number.MAX_SAFE_INTEGER
}={}){
    cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms:{$gte: minimumNumberOfBedrooms},
        bathrooms:{$gte: minimumNumberOfBathrooms}
    }).sort({ last_review: -1}).limit(maximumNumberOfResults);
    
    results = await cursor.toArray();

    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
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


