use("CRUD")
db.crud.insertOne({name:"alu"})
// db is CRUD now

// db.crud.insertMany([
//     {name:"alu"},
//     {name:"alu"},
//     {name:"alu"},
//     {name:"alu"},
//     {name:"alu"},
//     {name:"alu"},
//     {name:"gta5"},
// ])
// db.crud.findOneAndDelete({
//     name:"gta5"
// })
db.crud.insertOne({
    name:"ANSHU",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
})
db.crud.findOne({
    name:"ANSHU"
})