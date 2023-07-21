import { Resource } from './interfaces'
import * as api from '../api'

const resources: Resource[] = [];

async function initResource() {
    let response = await api.getResourceList();
    if (response && response.status === 200) {
        resources.push(...<Resource[]>response.data)
    } else {
        console.log("get resource list failed.");
    }
    return resources;
}

export const resourceList = async () => {
    if (resources.length <= 0) {
        await initResource();
    }
    return resources;
}