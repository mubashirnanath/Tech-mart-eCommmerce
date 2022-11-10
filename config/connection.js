const mongoClient = require('mongodb').MongoClient;
const state ={
    db:null
}
module.exports.connect=function (done) {
    const url='mongodb+srv://techmart:pvt9QjwIwS9Cv8QZ@cluster0.hmj39kz.mongodb.net/test'
    const dbname='Tech-mart'
    // const dbname='Maavi-Store'
    
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)

        state.db=data.db(dbname)
        
    })
    done()
}

module.exports.get=function(){
    return state.db
}
