import { ref } from 'vue'
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

export const getResourceList = async () => {
    if (resources.length <= 0) {
        await initResource();
    }
    return resources;
}


export async function getPermissions() {
    const username = localStorage.getItem("username");
    const response = await api.getUserPermission(username ? username : "");
    if (response && response.status === 200) {
        return response.data;
    } else {
        console.log('get user permission failed.')
        return [];
    }
}