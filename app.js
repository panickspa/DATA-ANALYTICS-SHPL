const fs = require("fs")

/* 
    Read json file
*/
var e = fs.readFileSync("./contacts.json",{
    encoding: "utf8"
})

const { Parser } = require('json2csv');

var data = JSON.parse(e);

/* Convert "" to undefined */
function bConvert(o){
    o.Email = o.Email ? o.Email.length > 0 ? o.Email : undefined : undefined
    o.Phone = o.Phone ? o.Phone.length > 0 ? o.Phone : undefined : undefined
    o.OrderId = o.OrderId ? o.OrderId.length > 0 ? o.OrderId : undefined : undefined
    return o
}

/* Sum Callback */
function sumContact(a,b){
    return a.Contacts+b.Contacts
}

/* Getting result */
var result = data.map((e,i,a) => {
    var dTemp = a
    var flag = true
    var oNow = e
    var linkage = []
    var temp = {}
    // var contacts = e.Contacts;
    // console.log("contacts 36", typeof contacts, contacts)
    /* 
        Analyze data    
    */
    while(flag){
        oNow = bConvert(oNow)
        dTemp = dTemp.filter(e => e.Id != oNow.Id)
        // console.log(dTemp.length)
        if(oNow.Email){
            temp = dTemp.find(e => e.Email == oNow.Email && e.Id != oNow.Id)
            // console.log(temp)
            if(temp){
                linkage.push({
                    Id: temp.Id,

                })
                oNow.Id = temp.Id
                oNow.Email = temp.Email
                oNow.Phone = temp.Phone
                oNow.OrderId = temp.OrderId
                // contacts = contacts + (isNaN(oNow.Contacts) ? oNow.Contacts : 0)
            }else{
                oNow.Email = undefined
            }
        }else if(oNow.Phone){
            temp = dTemp.find(e => e.Phone == oNow.Phone && e.Id != oNow.iId)
            if(temp){
                linkage.push(
                    temp.Id
                )
                oNow.Id = temp.Id
                oNow.Email = temp.Email
                oNow.Phone = temp.Phone
                oNow.OrderId = temp.OrderId
                // contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
            }else{
                oNow.Phone = undefined
            }
        }else if(oNow.OrderId){
            temp = dTemp.find(e => e.OrderId == oNow.OrderId && e.Id != oNow.Id)
            if(temp){
                linkage.push(
                    temp.Id
                )
                oNow.Id = temp.Id
                oNow.Email = temp.Email
                oNow.Phone = temp.Phone
                oNow.OrderId = temp.OrderId
                // contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
            }else{
                oNow.OrderId = undefined
            }
        }else{
            flag = false
            // console.log("false")
        }
    }    
    if(linkage.length > 0) {
        console.log(
            {
                ticket_id: a[i].Id,
                "ticket_trace/contact": `${linkage.map(e => e.id).join("-")}, ${contacts.reduce(sumArray,0)}`
            }
        )
        return {
            ticket_id: a[i].Id,
            "ticket_trace/contact": `${linkage.map(e => e.id).join("-")}, ${contacts.reduce(sumArray,0)}`
        }
    }
    else{
        console.log(
            {
                ticket_id: a[i].Id,
                "ticket_trace/contact": `${linkage.join("-")}, ${contacts}`
            }
        )
        return {
            ticket_id: a[i].Id,
            "ticket_trace/contact": `${a[i].id}, ${contacts}`
        }
    }
    
});

const fields = ['ticket_id', 'ticket_trace/contact'];
const opts = { fields };

try {
    /* 
        Parseing json to csv
    */
    const parser = new Parser(opts)
    const csv = parser.parse(result)
    fs.writeFileSync("./result.csv", csv, function(err){
        if(err) console.error(err)
    })
} catch (err) {
    console.error(err)
}


