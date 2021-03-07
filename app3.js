const fs = require("fs")

/* 
    Read json file
*/
var e = fs.readFileSync("./contacts.json",{
    encoding: "utf8"
})

var data = JSON.parse(e)

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
for (var i=0; i<data.length; i++){
    if(data[i]){
        let e = data[i]
        var dTemp = data
        var flag = true
        var oNow = e
        var tIdx = i
        var linkage = []
        var temp = {}
        var contacts = e.Contacts;
        // console.log("contacts 36", typeof contacts, contacts)
        /* 
            Analyze data    
        */
        dTemp.splice(i,1);
        oNow.tracedBy = []
        while(flag){
            oNow = bConvert(oNow)
            if(oNow.Email){
                tIdx = dTemp.findIndex(e => e.Email == oNow.Email)
                // console.log(temp)
                if(tIdx > -1){
                    temp = dTemp[tIdx]
                    linkage.push(
                        temp.Id
                    )
                    dTemp.splice(tIdx, 1)
                    oNow.Id = temp.Id
                    oNow.Email = temp.Email
                    oNow.Phone = temp.Phone
                    oNow.OrderId = temp.OrderId
                    contacts = contacts + (isNaN(oNow.Contacts) ? oNow.Contacts : 0)
                    oNow.tracedBy.push("Email")
                }else{
                    oNow.tracedBy.push("Email")
                    oNow.Email = undefined
                }
            }else if(oNow.Phone){
                tIdx = dTemp.findIndex(e => e.Phone == oNow.Phone)
                if(tIdx > -1){
                    temp = dTemp[tIdx]
                    linkage.push(
                        temp.Id
                    )
                    dTemp.splice(tIdx, 1)
                    oNow.Id = temp.Id
                    oNow.Email = temp.Email
                    oNow.Phone = temp.Phone
                    oNow.OrderId = temp.OrderId
                    contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
                    oNow.tracedBy.push("Phone")
                }else{
                    oNow.tracedBy.push("Phone")
                    oNow.Phone = undefined
                }
            }else if(oNow.OrderId){
                tIdx = dTemp.findIndex(e => e.OrderId == oNow.OrderId && e.Id != oNow.Id)
                if(tIdx > -1){
                    temp = dTemp[tIdx]
                    linkage.push(
                        temp.Id
                    )
                    dTemp.splice(tIdx, 1)
                    oNow.Id = temp.Id
                    oNow.Email = temp.Email
                    oNow.Phone = temp.Phone
                    oNow.OrderId = temp.OrderId
                    contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
                    oNow.tracedBy.push("OrderId")
                }else{
                    oNow.tracedBy.push("OrderId")
                    oNow.OrderId = undefined
                }
            }else{
                oNow.tracedBy = []
                flag = false
                // console.log("false")
            }
        }    
        if(linkage.length > 0) {
            linkage.push(data[i])
            linkage.sort(
                function(a,b){
                    return Number(a) - Number(b)
                }
            )
            console.log({
                ticket_id: data[i].Id,
                "ticket_trace/contact": `${linkage.map(e => e.Id).join("-")}, ${contacts}`
            })
            result.push( {
                ticket_id: data[i].Id,
                "ticket_trace/contact": `${linkage.map(e => e.Id).join("-")}, ${contacts}`
            })
        }
        else {
            console.log(
                {
                    ticket_id: data[i].Id,
                    "ticket_trace/contact": `${data[i].Id}, ${contacts}`
                }
            )
            result.push(
                {
                    ticket_id: data[i].Id,
                    "ticket_trace/contact": `${data[i].Id}, ${contacts}`
                }
            )
        }
    }
}

// var result = data.map((e,i,a) => {
//     var dTemp = a
//     var flag = true
//     var oNow = e
//     var linkage = []
//     var temp = {}
//     var contacts = e.Contacts;
//     // console.log("contacts 36", typeof contacts, contacts)
//     /* 
//         Analyze data    
//     */
//     while(flag){
//         oNow = bConvert(oNow)
//         dTemp = dTemp.filter(e => e.Id != oNow.Id)
//         // console.log(dTemp.length)
//         if(oNow.Email){
//             temp = dTemp.find(e => e.Email == oNow.Email && e.Id != oNow.Id)
//             // console.log(temp)
//             if(temp){
//                 linkage.push(
//                     temp.Id
//                 )
//                 oNow.Id = temp.Id
//                 oNow.Email = temp.Email
//                 oNow.Phone = temp.Phone
//                 oNow.OrderId = temp.OrderId
//                 contacts = contacts + (isNaN(oNow.Contacts) ? oNow.Contacts : 0)
//             }else{
//                 oNow = {}
//             }
//         }else if(oNow.Phone){
//             temp = dTemp.find(e => e.Phone == oNow.Phone && e.Id != oNow.iId)
//             if(temp){
//                 linkage.push(
//                     temp.Id
//                 )
//                 oNow.Id = temp.Id
//                 oNow.Email = temp.Email
//                 oNow.Phone = temp.Phone
//                 oNow.OrderId = temp.OrderId
//                 contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
//             }else{
//                 oNow = {}
//             }
//         }else if(oNow.OrderId){
//             temp = dTemp.find(e => e.OrderId == oNow.OrderId && e.Id != oNow.Id)
//             if(temp){
//                 linkage.push(
//                     temp.Id
//                 )
//                 oNow.Id = temp.Id
//                 oNow.Email = temp.Email
//                 oNow.Phone = temp.Phone
//                 oNow.OrderId = temp.OrderId
//                 contacts = contacts+(isNaN(oNow.Contacts) ? oNow.Contacts : 0)
//             }else{
//                 oNow = {}
//             }
//         }else{
//             flag = false
//             // console.log("false")
//         }
//     }    
//     if(linkage.length > 0) 
//     return {
//         ticket_id: a[i].Id,
//         "ticket_trace/contact": `${linkage.join("-")}, ${contacts}`
//     }
// });

const fields = ['ticket_id', 'ticket_trace/contact'];
const opts = { fields };

try {
    /* 
        Parseing json to csv
    */
    const parser = new Parser(opts)
    const csv = parser.parse(result)
    fs.writeFileSync("./result_2.csv", csv, function(err){
        if(err) console.error(err)
    })
} catch (err) {
    console.error(err)
}

