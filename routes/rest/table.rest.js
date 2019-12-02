const express = require('express')
const mongoose = require('mongoose')
const restMiddleware = require('../../middleware/rest/rest.middleware')

const {Table,verifyInput} = require('../../models/table.rest')

const sanitize = require('../../utility/santize-input')
/**
 * 
 * WARNING : NO SANITIZER HERE!!!
 * 
 */

const router = express.Router()

router.post("/table/add",[restMiddleware.isRestLoggedIn,restMiddleware.isDocsVerified,restMiddleware.isOTPVerified,restMiddleware.isProfileComplete],async (req,res)=>{
    let input = {inputObject} = req.body
    //console.log(input.inputObject)
    
    const {error} = verifyInput(input)
    if(error)
    return res.status(400).send({
        success: false,
        message: error.details[0].message
    })
    let tableNoArray = []
    for(var i=0;i<input.inputObject.length;i++){
        tableNoArray.push(input.inputObject[i].table_no)
        for(var j=i+1;j<input.inputObject.length;j++){
            if(input.inputObject[i].table_no == input.inputObject[j].table_no){
                // console.log(input.inputObject[i].table_no,input.inputObject[j].table_no)
                return res.status(400).send({
                    success: false,
                    message: `Duplicate Table No. ${input.inputObject[i].table_no}`
                })
                
            }

        }
    }
    
    let tableFound = await Table.findOne({rest_id: req.currentRest._id})
    //udate existing record
    if(tableFound){
        let dupFound = await Table.findOne({rest_id: req.currentRest._id,'tableInfo.table_no': {$in: tableNoArray}})
        if(dupFound)
        return res.status(400).send({
            success: false,
            message: "Duplicate Table no. found in db"
        })
        let pshArray = new Array()
        await input.inputObject.forEach((ele)=>{
            //sanitize.sanitizerEscape(ele)
            pshArray.push(ele)
        })
        let result = await Table.updateOne({rest_id: req.currentRest._id},{
             $push: {tableInfo: pshArray}
        })
        if(result.ok)
        return res.status(200).send({
            success: true,
            message: "Table(s) added successfully."
        })
        else
        return res.status(200).send({
            success: true,
            message: "Table(s) were not added."
        })
    }
    //create new table
    else{
    let table = new Table({
        rest_id: req.currentRest._id,        
    })
    await input.inputObject.forEach(async (ele)=>{
        table.tableInfo.push({
            table_no: ele.table_no,
            table_seat: ele.table_seat
        })
    })
    let result = await table.save()
    if(result._id)
    return res.status(200).send({
        success: true,
        message: "Table(s) added successfully"
    })
    }

})

module.exports = router