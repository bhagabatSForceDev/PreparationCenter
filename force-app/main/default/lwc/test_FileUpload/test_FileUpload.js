import { api,LightningElement } from 'lwc';
import readFileData from '@salesforce/apex/FileUploadHandler.readFileData';
export default class Test_FileUpload extends LightningElement {

    @api
    myRecordId;
    blobData;

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        console.log('No. of files uploaded : ' + JSON.stringify(uploadedFiles));
        readFileData({filedata: JSON.stringify(uploadedFiles[0])}).then((result)=>{
            console.log('INSIDE readFileData'+JSON.stringify(result));
            this.blobData=result;
        }).catch((error)=>{
            console.error(JSON.stringify(error));
        })
    }

    handleFileSelect(event){
        let files=event.target.files;
        console.log('files: '+JSON.stringify(files));

        let queryFiles=this.template.querySelector('.input');
        console.log('queryFiles: ',JSON.stringify(queryFiles));
    }
}