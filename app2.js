const fs = require("fs")

/* 
    Read json file
*/
var e = fs.readFileSync("./contacts.json",{
    encoding: "utf8"
})

const data = JSON.parse(e)

console.log(data.length)

const { Parser } = require('json2csv');

/* Convert "" to undefined */
function bConvert(o){
    o.Email = o.Email ? o.Email.length > 0 ? o.Email : undefined : undefined
    o.Phone = o.Phone ? o.Phone.length > 0 ? o.Phone : undefined : undefined
    o.OrderId = o.OrderId ? o.OrderId.length > 0 ? o.OrderId : undefined : undefined
    return o
}

/* Getting result */
var result = []
console.log("analyzing ...")

for (var i in data){
    // console.log(e)
    // let dTemp = [data].flat()
    let flag = true
    let oNow = {
        id: data[i].Id,
        tIdx: data[i].Id,
        Email: data[i].Email,
        Phone: data[i].Phone,
        Contacts: data[i].Contacts,
        OrderId: data[i].OrderId
    }
    let linkage = []
    let temp = {}
    let contacts = data[i].Contacts;
    // dTemp.splice(tIdx,1);
    while(flag){
        oNow = bConvert(oNow)
        if(oNow.Email){
            oNow.tIdx = data.findIndex(e => e.Email == oNow.Email && e.Id != data[i].Id && e.Id != oNow.Id && !linkage.find(id => e.Id == id) )
            if(oNow.tIdx > -1){
                temp = data[oNow.tIdx]
                linkage.push(
                    temp.Id
                )
                oNow.Id = temp.Id
                oNow.Email = temp.Email
                oNow.Phone = temp.Phone
                oNow.OrderId = temp.OrderId
                contacts = contacts + (isNaN(oNow.Contacts) ? oNow.Contacts : 0)
            }else{
                oNow = {}
            }
        }else if(oNow.Phone){
            oNow.tIdx = data.findIndex(e => e.Phone == oNow.Phone && e.Id != data[i].Id && e.Id != oNow.Id && !linkage.find(id => e.Id == id))
            if(oNow.tIdx > -1){
                temp = data[oNow.tIdx]
                linkage.push(
                    temp.Id
                )
                oNow.Id = temp.Id
                oNow.Email = temp.Email
                oNow.Phone = temp.Phone
                oNow.OrderId = temp.OrderId
                contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
            }else{
                oNow = {}
            }
        }else if(oNow.OrderId){
            oNow.tIdx = data.findIndex(e => e.OrderId == oNow.OrderId && e.Id != data[i].Id && e.Id != oNow.Id && !linkage.find(id => e.Id == id))
            if(oNow.tIdx > -1){
                temp = data[oNow.tIdx]
                linkage.push(
                    temp.Id
                )
                oNow.Id = temp.Id
                oNow.Email = temp.Email
                oNow.Phone = temp.Phone
                oNow.OrderId = temp.OrderId
                contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
            }else{
                oNow = {}
            }
        }else{
            flag = false
        }
    }
    if(linkage.length > 0) {
        linkage.push(data[i].Id)
        linkage.sort(
            function(a,b){
                return Number(a) - Number(b)
            }
        )
        console.log(i,{
            ticket_id: data[i].Id,
            "ticket_trace/contact": `${linkage.join("-")}, ${contacts}`
        })
        result.push( {
            ticket_id: data[i].Id,
            "ticket_trace/contact": `${linkage.join("-")}, ${contacts}`
        })
    }
    else {
        console.log(i,
            {
                ticket_id: data[i].Id,
                "ticket_trace/contact": `${i}, ${contacts}`
            }
        )
        result.push(
            {
                ticket_id: data[i].Id,
                "ticket_trace/contact": `${i}, ${contacts}`
            }
        )
    }
}

const fields = ['ticket_id', 'ticket_trace/contact'];
const opts = { fields };

try {
    /* 
        Parsing json to csv
    */
    console.log("parsing ...")
    const parser = new Parser(opts)
    const csv = parser.parse(result)
    fs.writeFileSync(`./result_2_${new Date()}.csv`, csv, function(err){
        if(err) console.error(err)
        console.log("done!!")
    })
} catch (err) {
    console.error(err)
}


