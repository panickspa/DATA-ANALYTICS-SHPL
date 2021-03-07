const { Worker } = require('worker_threads') 

/* 
    Creating worker
*/

const n = 500000

const thread = 2

function runWorker(workerData){
    return new Promise((res, rej) => {
        const worker = new Worker(
            "./worker.js", {workerData}
        )
        worker.on('message', (e)=>{
            console.log(e)
        })
        worker.on('error', rej)
        worker.on('exit', code => {
            if(code !== 0){
                rej(new Error(`Stopped the Worker Thread with the exit code: ${code}`))
            }
        })
    })
}
async function run(range) {
    await runWorker(
        {
            data: "./contacts.json",
            range: range
        }
    )
}

run([0,50000]).catch(err => {console.error(err)})
run([50000,100000]).catch(err => {console.error(err)})