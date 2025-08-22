import Joi from "joi";

const data=['body','params','query']

export const validation=(schema)=>{
    return (req,res,next)=>{
        const validationErrors=[]

        data.forEach(x => {
            const result=schema[x]?.validate(req[x],{abortEarly:false})
            if (result?.error) {
                validationErrors.push(result.error)
            }
        });
        
        if(validationErrors.length>0){
            return res.status(400).json({errors:validationErrors})
        }else{
            next()
        }
    }
}

export const generalValidation={
    name:Joi.string().min(3).max(30),
    email:Joi.string().email(),
    password:Joi.string().min(8).max(20),
    confrimPassword:Joi.string().valid(Joi.ref("password")),
    phone:Joi.string().length(11),
    age:Joi.number().min(18).max(50),
    
}
