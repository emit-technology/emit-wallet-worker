import Service from "./servicePool";
import {Message, Method, MintData, MintState} from "../../types";

const services:Map<string,Service> = new Map<string, Service>()

self.addEventListener('message', e => {
    if (e && e.data && e.data.method) {
        const message: Message = e.data;
        if (message.method == Method.getEpochPollKeys){
            const entries = services.entries();
            let next = entries.next();
            const keys:Array<any> = [];
            while (!next.done){
                const s:Service = next.value[1];
                if(s && s.temp.state == MintState.running){
                    keys.push(s.temp.taskId);
                }
                next = entries.next()
            }
            message.result=keys
            // @ts-ignore
            self.postMessage(message)
            return
        }

        if(message.data){
            let service:Service;
            let key = message.data
            if(message.method == Method.powInit){
                const mintData:MintData = message.data;
                key = mintData.accountScenes;
            }
            if(services.has(key)){
                service = services.get(key);
            }else{
                service = new Service()
                services.set(key,service)
            }
            service.handle(e)
        }
    }

})

export default services