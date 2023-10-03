var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')

module.exports = {

    // function for admin signup

    doSignUp:(adminData) => {
        return new Promise (async(resolve,reject)=>{
            adminData.Password = await bcrypt.hash(adminData.Password,10);
            db.get().collection(collection.ADMIN_COLLECTION).
            insertOne(adminData).then((data)=>{
                resolve(data.insertedId);
            })
        })
    },

    // function for admin login

    doLogin:(adminData) => {
        return new Promise(async(resolve,reject) => {
            let loginStatus = false
            let response = {}
            let adminUser = await db.get().collection(collection.ADMIN_COLLECTION).
            findOne({Email:adminData.Email})
            
            if(adminUser){
                bcrypt.compare(adminData.Password,adminUser.Password).
                then((status)=>{
                    if(status){
                        console.log("Login success");
                        response.adminUser = adminUser;
                        response.status = true;
                        resolve(response)
                    }else{
                        console.log("Login failed");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("User not found");
                resolve({status:false})
            }
        })
    },
}