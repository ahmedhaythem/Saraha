
export const findOne= async(model,filter={})=>{
    const doc =await model.findOne(filter)
    return doc
}

export const findById= async(model,filter={})=>{
    const doc =await model.findById(filter)
    return doc
}