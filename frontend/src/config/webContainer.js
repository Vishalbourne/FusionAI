import { WebContainer } from '@webcontainer/api';

// Call only once
let webContainerInstance = null

// Call only once
export const getWebContainerInstance = async() =>{
 if(webContainerInstance === null){
    webContainerInstance = await WebContainer.boot()
 }
  return webContainerInstance
}