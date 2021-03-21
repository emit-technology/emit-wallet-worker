import Service from "../service";

const service = new Service()

self.addEventListener('message', e => {
    service.handle(e)
})

export default service