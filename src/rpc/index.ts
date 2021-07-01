import axios from 'axios';

class Rpc {
    post = async (url:string,data:any)=>{
        const rest = await axios.post(url,data)
        return rest.data;
    }

    async jsonRpc(host,method: any, params: any) {
        const data: any = {
            id: 0,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        return new Promise((resolve, reject) => {
            axios.post(host, data).then((resp: any) => {
                if (resp.data.error) {
                    reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                console.error("rpc post err: ", e)
                reject(e)
            })
        })
    }
}
const rpc = new Rpc()

export default rpc