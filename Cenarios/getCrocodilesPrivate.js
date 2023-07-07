import http from 'k6/http';
import { check, sleep} from 'k6';

export const options ={
    vus: 100,
    duration :'10s',
    thresholds:{
        http_req_failed:['rate > 0.01'],
        http_req_duration: ['p(95) < 250']
    }
}
const base_url = 'https://test-api.k6.io';

    export function setup(){
        const loginRes = http.post(`${base_url}/auth/token/login/`,{
            username:'0.4170846466352545@mail.com',
            password:'user123'
    });
    const token = loginRes.json('access');
    return token;
}

export default function(token){
    const params = {
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
        }
    }
    const response = http.get(`${base_url}/my/crocodiles/`,params);

    check(response,{
        'status code 200': (r) => r.status === 200
    });

    sleep(1);
}