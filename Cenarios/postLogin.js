import http from 'k6/http';
import { check, sleep} from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export const options ={
    stages:[
        { duration:'5s', target:5},
        { duration:'5s', target:5},
        { duration:'2s', target:50},
        { duration:'2s', target:50},
        { duration:'5s', target:0},
    ],
    threshols:{
        http_req_failed:['rate < 0.01'], // requisições com falha inferior a 1%
    }
};

const csvData = new SharedArray('Ler dados', ()=>{
    return papaparse.parse(open('/config/usuarios.csv'),{header:true}).data;
});

export default ()=>{
const base_url = `https://test-api.k6.io`;
const USER = csvData[Math.floor(Math.random() * csvData.length)].email;
const PASS = 'user123';

console.log(USER);

    const response = http.post(`${base_url}/auth/token/login/`, {
            username:USER,
            password:PASS
    });

    check(response,{
        'sucesso login': (r) => r.status === 200,
        'token gerado':(r) => r.json('acess') !== ''
    });
    sleep(1);

};