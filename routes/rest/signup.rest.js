const express = require('express')
const santizer = require('sanitizer')
const {Rest,validateRestSignup} = require('../../models/rest')
const randomstring = require('randomstring')

const router = express.Router()

router.post("/rest/signup",async (req,res)=>{
    try {
    let input = {name,email,password} = req.body
    if(!input.email || !input.name || !input.password)
    return res.status(400).send({
        success: false,
        message: "All fields are required."
    })
    Object.keys(input).forEach((props)=>{
        if(input[props]!== null)
        input[props] = santizer.escape(input[props])
    })


    if(await Rest.findOne({email: input.email}))
    return res.status(400).send({
        success: false,
        message: "Email already taken."
    })

    let {error} = await validateRestSignup(input)
    if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });
    let rest = new Rest({
        name: input.name,
        email: input.email
    })
    rest.password = await rest.generateHash(input.password)
    const token = await rest.generateAuthToken(input.email);
    let verifyToken = await randomstring.generate({
        length: 50,
        charset: 'hex'
      });
      let verifyOTP = await randomstring.generate({
        length: 6,
        charset: 'numeric'
      });
      rest.verify.emailVerifyToken = verifyToken
      rest.verify.otp = verifyOTP
      rest.dateJoined = Date.now();
    let errFlag = await rest.save((err,res)=>{
        if(err)
        return 1
        else
        return 0
    })
    if(errFlag)
    return res.status(400).send({
        success: false,
        message: "Signup failed."
    })
    else
    return res.header('x-auth-token',token).status(200).send({
        success: true,
        message: "Signup successful."
    })
    } catch (error) {
        console.log("Catch " + error)
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong"
        })
    }
    
})


module.exports = router