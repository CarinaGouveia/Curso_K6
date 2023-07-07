//Importações
import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//Configuração
export const options ={
    vus: 1,
    duration :'3s',
    thresholds:{
        checks:['rate > 0.99']
    }
}

//verificação
export default function(){
    const base_url = 'https://test-api.k6.io/public/crocodiles/';
    const response = http.get(base_url);

    check(response,{
        'status code 200': (r) => r.status === 200
    });

}

export function handleSummary(data) {
    return {
      "teste_k6.html": htmlReport(data),
    };
  }
