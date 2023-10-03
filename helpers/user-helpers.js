var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('express')
const { resolve } = require('promise')
var objectId = require('mongodb').ObjectId;

module.exports = {

    // function for user signup

    doUserSignup:(userData) => {
        return new Promise(async(resolve,reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            db.get().collection(collection.USER_COLLECTION).
            insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },

    // function for user login

    doUserLOgin:(userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            let user = await db.get().collection(collection.USER_COLLECTION).
            findOne({ Email: userData.Email });
            if(user) {
                bcrypt.compare(userData.Password, user.Password).
                then((status) => {
                    if(status) {
                        console.log("User login success!!");
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log("User login failed!!");
                        resolve({status:false});
                    }
                })
            } else {
                console.log("User not found !!");
                resolve({status:false})
            }
        })
    },

    // function to get all users

    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let usersData=await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(usersData);
        })
    },

    // function to get usersData

    getUsersData:(userId) => {
        return new Promise((resolve,reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: new ObjectId(userId) }).then((userDetails) => {
                console.log(userDetails);
                resolve(userDetails)
            })
        })
    },

    // function to update userDetails

    updateUserDetails:(userId, userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).
            updateOne({ _id: new ObjectId(userId)}, {
                $set:{
                    Username: userDetails.Username,
                    Email: userDetails.Email,
                    Mobile: userDetails.Mobile
                }
            }).then((response) => {
                resolve()
            })
        })
    },

    // funtion to delete user

    deleteUser:(userId) => {
        return new Promise((resolve,reject) => {
            db.get().collection(collection.USER_COLLECTION).
            deleteOne({ _id:new ObjectId(userId)} ).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    }
}