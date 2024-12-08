import axios from "axios";
import { urlRoutes } from "./urlService";
import { apiUrl } from "../../constant";


// chat with ai

const chatwithAi = (sendMessage:any) =>{
    const Url = `${apiUrl}/${urlRoutes.aiChat}`
    return axios.post(Url, sendMessage);
}

export {chatwithAi}