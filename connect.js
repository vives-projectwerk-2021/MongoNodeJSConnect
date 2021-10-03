const {MongoClient} = require ('mongodb');

async function main(){

    const uri ="mongodb+srv://AaronVanV:M0ng0dAar0n@aaronvanv.ocujk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client =new MongoClient(uri);

    try{
        await client.connect();

        await listDataBases(client);

    }catch(e){
        console.error(e);
    }finally{
        await client.close();
    }
}

main().catch(console.error);

async function listDataBases(client){
    databasesList = await client.db().admin().listDatabases();
    
    console.log("DB:");
    databasesList.databases.forEach(db=>{
        console.log(`- ${db.name}`);
    })
}