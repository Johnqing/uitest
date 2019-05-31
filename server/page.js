const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');

const taskOpen = require('./task/open');
const db = require('./utils/db');

let page = new Router();

function upload(files, params){
    const id = params.id;
    const config = { 
        screenshotUrl: params.jump_url, project: `${params.project}_${params.pid}`, id, 
        username: params.username, password: params.password,
        viewport_width: params.viewport_width, 
        hotelName: params.hotel_name
    };
    const file = files.uipng;
    const fileUploadPath = path.resolve(__dirname, `../client/dist/img/${config.project}/${config.id}`);
    child_process.execSync(`mkdir -p ${fileUploadPath}`)
	const reader = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(`${fileUploadPath}/ui.png`);
    reader.pipe(writeStream);

    writeStream.on('close', async function(){
        let sql = 'insert into project (project, pid, viewport_width, jump_url, username, password, id) values(?)'
        await db.query( sql, [[params.project, params.pid, params.viewport_width, params.jump_url, params.username, params.password, id]] );
        const data = await taskOpen(config);
        await db.query( `update project set create_status = 1 where id = ?`, [id] );
        await db.query( `insert into result (id, result) values(?)`, [[id, data]] );
    });
}

page.get('/result', async ( ctx )=>{
    const { query } = ctx.request;
    const data = await db.query( `select * from project where id = ? and create_status = 1`, [query.key] );
    if(!data.length){
        ctx.body = {
            status: 1000,
            msg: 'ok'
        }
        return 
    }
    const currData = data[0];
    const data2 = await db.query( `select * from result where id = ?`, [query.key] );
    currData.result = data2[0];
    ctx.body = {
        status: 200,
        msg: 'ok',
        data: currData
    }
})
page.post('/submit', async ( ctx )=>{
    const { body, files } = ctx.request;
    const id = new Date().getTime();
    upload(files, {
        project: body.project, 
        pid:body.pid, 
        viewport_width: body.viewport_width, 
        jump_url: body.jump_url, 
        username: body.username, 
        password: body.password, 
        id,
        hotel_name: body.hotel_name
    });
    ctx.body = {
        status: 200,
        msg: '任务处理中',
        data: {
            key: id
        }
    }
})
module.exports = page;