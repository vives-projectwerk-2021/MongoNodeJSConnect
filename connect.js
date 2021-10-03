const { exists } = require('fs');
const {MongoClient} = require ('mongodb');
const { consumers } = require('stream');

async function main(){
    // this uri can be found in the MongoDB Atlas under "connect" and then "connect you application" (remember to change "<password>" to actual password)
    const uri ="mongodb+srv://AaronVanV:M0ng0dAar0n@aaronvanv.ocujk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client =new MongoClient(uri);

    try{
        await client.connect();

        //call functions

        
        //Login
        //await findUserByUserName(client,"AaronFreddy","Coolguy69");
        //await findAllUsers(client);

        //Sign Up
        //await createUser(client,"Luc","GameOver");

        //Change Password
        //await changePassword(client,"Luc","GameOver","LOL");

        //Delete User
        //await deleteUser(client,"Luc","StartGame",true);



        //POSSIBLE FUTURE FEATURES
        //Delete Users older then (no date data for users yet)
        //await deleteAllUsersBeforeDate(client, new Date("2019-02-15"));

        //Add variable to all accounts(can be handy later on)
        //await updateAddVariable(client);

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

//LOGIN
//checks if there is a user with both the right username AND  right password
async function findUserByUserName(client, name,psswrd){
    result = await client.db("Project").collection("accounts").findOne({$and:[{username:name},{password:psswrd}]})

    if (result){
        console.log(`Found a user in collection with name '${name}'`);
        console.log(result);
    }else{
        console.log(`No users were found with name '${name}'`);
    }
}

//SHOW ALL USERS
//returns all matching documents with the query
async function findAllUsers(client){
    result = await client.db("Project").collection("accounts").find({}).toArray();

    console.log(`Found ${result.length} users in database`);
    console.log(result);
   
}


//SIGN UP

//checks if user already exits and if it doesn't, creates a new user
async function createUser(client,name,psswrd){
    result = await client.db("Project").collection("accounts").findOne({username:name});

    if (result){
        console.log(`There is already a user with name '${name}'`);
    }else{
        createNew = await client.db("Project").collection("accounts").insertOne({username:name,password:psswrd});

        console.log(`New user created with the following id : ${createNew.insertedId} and username: ${name}`);
    }
    

}



//UPDATE

//change password
async function changePassword(client,name,psswrd,newPsswrd){
    changePsswd = await client.db("Project").collection("accounts").findOne({$and:[{username:name},{password:psswrd}]})

    if (changePsswd){

        result= await client.db("Project").collection("accounts").updateOne({$and:[{username:name},{password:psswrd}]},{$set: {password:newPsswrd}});
        console.log(`Changed password of user "${name}"`);
    }else{
        console.log("Wrong username or password");
    }

    
}



//updates all listings to have a certain variable
async function updateAddVariable(client){
    result= await client.db("Project").collection("accounts").updateMany(
        {variable:{$exists: false}}, {$set:{variable:"Empty"}});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} documents was/were updated`);
}



//DELETE

//deleteOne deletes only 1 matching document
async function deleteUser(client, name,psswrd,sure){
    deleteAcc = await client.db("Project").collection("accounts").findOne({$and:[{username:name},{password:psswrd}]})

    if (deleteAcc && sure){

        result= await client.db("Project").collection("accounts").deleteOne({$and:[{username:name},{password:psswrd}]});
        console.log(`Deleted user "${name}"`);
    }else{
        console.log("Wrong username or password or sure is set to false");
    }
}

//deletes all users matching the query (here users older than stated date)
async function deleteAllUsersBeforeDate(client,date){
    result= await client.db("Project").collection("accounts").deleteMany(
        {"made_at_date":{$lt:date}});

    console.log(`${result.deletedCount} document(s) were deleted`);
    

}