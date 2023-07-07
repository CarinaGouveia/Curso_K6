//Desafio fazer um post no endpoint privado

//Importar
import { check , sleep} from "k6";
import http from "k6/http";


//Configuração
export const options = {
        stages:[ { duration:'10s' , target:10}], // duração de 10s com 10 usuarios
        threshols:{
            checks:['rate > 0.95'], // 95% das requisição deverão ser sucesso
            http_req_failed:['rate < 0.01'], //requisições com falha inferior a 1%
            http_req_duration:['p(95) < 250'] // 95% das requisições tem que ser inferios a 250 milessegundos
        }
}

//defininco constante fora do escopo de execução
const base_url =`https://test-api.k6.io`;

//Realizando login antes de fazer o post pois é necessário token
export function setup(){
    const loginResponse = http.post(`${base_url}/auth/token/login/`,{
        username:'0.4170846466352545@mail.com',
        password:'user123'
    });
//Pegando o retorno do post e inserindo em uma constante
    const token = loginResponse.json('access');
    return token
}

//Bloco de execução
export default (token)=>{
    
    //Dados de cadastro
    const name = "Antony";
    const sexo = "F";
    const data = "2000-02-05"

    //Requisição
    const response = http.post(`${base_url}/my/crocodiles/`, {
        //token no headers
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
        },
        //dados no body
        body:{
            name: name,
            sex:sexo,
            date_of_birth: data
        }
    });

    // cecks para validar o retorno
    check(response, {
        'Sucesso ao criar':(r) => r.status === 201,
        'Retorno': (r) => r.body !== ''
    })
sleep(1);
}

