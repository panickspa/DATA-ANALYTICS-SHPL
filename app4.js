const fs = require("fs")
const { Parser } = require('json2csv');
const { GPU } = require('gpu.js')
/* 
    Read json file
*/
var e = fs.readFileSync("./contacts.json",{
    encoding: "utf8"
})

const data = JSON.parse(e)

// console.log(data.length)


/* Convert "" to undefined */
function bConvert(o){
    o.Email = o.Email ? o.Email.length > 0 ? o.Email : undefined : undefined
    o.Phone = o.Phone ? o.Phone.length > 0 ? o.Phone : undefined : undefined
    o.OrderId = o.OrderId ? o.OrderId.length > 0 ? o.OrderId : undefined : undefined
    return o
}

/* Getting result */

function getResult(range){
    var result = []
    console.log("analyzing ...")
    for (var i=range[0]; i<=range[1]; i++){
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
        while(flag){
            oNow = bConvert(oNow)
            // console.log(e.Email == oNow.Email, e.Id != data[i].Id && e.Id != oNow.Id, !linkage.find(l => e.Id == l.Id))
            if(oNow.Email){
                oNow.tIdx = data.findIndex(
                    e => e.Email == oNow.Email && e.Id != data[i].Id && e.Id != oNow.Id && !linkage.find(l => e.Id == l.Id)
                )
                if(oNow.tIdx > -1){
                    temp = {
                        obj: data[oNow.tIdx],
                    }
                    linkage.push({
                        Id: data[oNow.tIdx].Id,
                        Contacts: isNaN(Number(data[oNow.tIdx].Contacts)) ? 0 : Number(data[oNow.tIdx].Contacts)
                    })
                    oNow = {
                        Id: temp.obj.Id,
                        Email: temp.obj.Email,
                        Phone: temp.obj.Phone,
                        OrderId: temp.obj.OrderId,
                        Contacts: isNaN(Number(temp.obj.Contacts)) ? 0 : Number(temp.obj.Contacts),
                    }
                    // temp.Contacts = temp.Contacts + (isNaN(temp.obj.Contacts) ? temp.obj.Contacts : 0)
                }else{
                    oNow.Email = undefined
                }
            }else if(oNow.Phone){
                oNow.tIdx = data.findIndex(
                    e => e.Phone == oNow.Phone && e.Id != data[i].Id && e.Id != oNow.Id && !linkage.find(l => e.Id == l.Id)
                )
                if(oNow.tIdx > -1){
                    temp = {
                        obj: data[oNow.tIdx],
                        Contacts: data[oNow.tIdx].Contacts
                    }
                    linkage.push({
                        Id: data[oNow.tIdx].Id,
                        Contacts: isNaN(Number(data[oNow.tIdx].Contacts)) ? 0 : Number(data[oNow.tIdx].Contacts)
                    })
                    oNow = {
                        Id: temp.obj.Id,
                        Email: temp.obj.Email,
                        Phone: temp.obj.Phone,
                        OrderId: temp.obj.OrderId,
                        Contacts: isNaN(Number(temp.obj.Contacts)) ? 0 : Number(temp.obj.Contacts),
                    }
                    // temp.Contacts = temp.Contacts+(isNaN(temp.Contacts) ? temp.Contacts : 0)
                }else{
                    oNow.Phone = undefined
                }
            }else if(oNow.OrderId){
                oNow.tIdx = data.findIndex(
                    e => e.OrderId == oNow.OrderId && e.Id != data[i].Id && e.Id != oNow.Id && !linkage.find(l => e.Id == l.Id)
                )
                if(oNow.tIdx > -1){
                    temp = {
                        obj: data[oNow.tIdx],
                    }
                    linkage.push({
                        Id: data[oNow.tIdx].Id,
                        Contacts: isNaN(Number(data[oNow.tIdx].Contacts)) ? 0 : Number(data[oNow.tIdx].Contacts)
                    })
                    oNow = {
                        Id: temp.obj.Id,
                        Email: temp.obj.Email,
                        Phone: temp.obj.Phone,
                        OrderId: temp.obj.OrderId,
                        Contacts: isNaN(Number(temp.obj.Contacts)) ? 0 : Number(temp.obj.Contacts),
                    }
                    // temp.Contacts = temp.Contacts+(isNaN(temp.obj.Contacts) ? temp.obj.Contacts : 0)
                }else{
                    oNow.OrderId = undefined
                }
            }else{
                flag = false
            }
            // console.log(linkage.reduce(sumContacts,0))
        }
        if(linkage.length > 0) {
            linkage.push({Id:data[i].Id, Contacts:isNaN(Number(data[i].Contacts)) ? 0 : Number(data[i].Contacts) })
            linkage.sort(
                function(a,b){
                    return Number(a) - Number(b)
                }
            )
            let rObj = {
                ticket_id: data[i].Id,
                "ticket_trace/contact": `${linkage.map(e => e.Id).join("-")}, ${linkage.map(e => e.Contacts).reduce((a,b)=>a+b,0)}`
            }
            console.log(i,rObj["ticket_trace/contact"])
            result.push(rObj)
        }
        else {
            let rObj = {
                ticket_id: data[i].Id,
                "ticket_trace/contact": `${i}, ${data[i].Contacts}`
            }
            console.log(i,
                rObj["ticket_trace/contact"]
            )
            result.push(
                rObj
            )
        }
    }
    return result
}

const gpu = new GPU()

const final_result = gpu.createKernel(
    getResult([0,1000])
)
console.log(final_result)

// const fields = ['ticket_id', 'ticket_trace/contact'];
// const opts = { fields };

// try {
//     /* 
//         Parsing json to csv
//     */
//     console.log("parsing ...")
//     const parser = new Parser(opts)
//     const csv = parser.parse(final_result)
//     fs.writeFileSync(`./result_2.csv`, csv, function(err){
//         if(err) console.error(err)
//         console.log("done!!")
//     })
// } catch (err) {
//     console.error(err)
// }


