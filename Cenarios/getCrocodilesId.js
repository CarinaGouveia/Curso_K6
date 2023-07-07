//Importações
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

//Configuração
export const options ={
    stages:[
        {duration:'10s', target:10}, // subida de usuario
        {duration:'10s', target:10}, // carga
        {duration:'10s', target:0}   // desaceleração
    ],
    thresholds:{
        checks:['rate > 0.95'],
        http_req_duration:['p(95) < 200']
    }
}

const data = new SharedArray('Leitura do json',()=>{
    return JSON.parse(open('/config/dados.json')).crocodilos
});

//verificação
export default function(){
    
    const crocodilos = data[Math.floor(Math.random() * data.length)].id; 

    const base_url = `https://test-api.k6.io/public/crocodiles/${crocodilos}`;
    const response = http.get(base_url);

    check(response,{
        'status code 200': (r) => r.status === 200
    });

    sleep(1);
}