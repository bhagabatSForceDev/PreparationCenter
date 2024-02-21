import { api,wire,LightningElement } from 'lwc';
import getImageAsBlob from '@salesforce/apex/GoogleDriveAPI.getImageData';
export default class Gd_displayImage extends LightningElement {

@api recordId;
isLoaded=false;
imgSrc;
@wire(getImageAsBlob,{recordId:"$recordId"}) imageData(result){
    console.log(result.data);
    const reader = new FileReader();
    if(result.data){
        //this.imgSrc=URL.createObjectURL(result.data);
        this.imgSrc=result.data;
        this.isLoaded=true;
    }else{
        console.error(JSON.stringify(result.error));
    }
}

}