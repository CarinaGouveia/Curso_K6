import http from 'k6/http';
import { check, sleep} from 'k6';

export const options ={
    stages:[{ duration:'10s', target:10}],
    threshols:{
        checks:['rate > 0.95'], // 95% das requisições com sucesso
        http_req_failed:['rate < 0.01'], // requisições com falha inferior a 1%
        http_req_duration:['p(95) < 500']//95% das requisições tem que ser inferior a 500milessegundos
    }
};

export default ()=>{
const base_url = `https://test-api.k6.io`;
const USER = `${Math.random()}@mail.com`;
const PASS = 'user123';

console.log(USER +" " + PASS);

    const response = http.post(`${base_url}/user/register/`, {
    
            username:USER,
            first_name: "crocodino",
            last_name: "dino",
            email:USER,
            password:PASS
    });

    check(response,{
        'sucesso ao registar': (r) => r.status === 201
    });
    sleep(1);

};