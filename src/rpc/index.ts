import axios from 'axios';

class Rpc {
    post = async (url:string,data:any)=>{
        const rest = await axios.post(url,data)
        return rest.data;
    }
}
const rpc = new Rpc()

export default rpc