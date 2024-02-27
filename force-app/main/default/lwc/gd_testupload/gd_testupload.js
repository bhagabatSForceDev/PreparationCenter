import { LightningElement, api } from 'lwc';
import createFile from '@salesforce/apex/GoogleDriveAPI.createFile';
import { ShowToastEvent } from "lightning/platformShowToastEvent"
import { RefreshEvent } from 'lightning/refresh';
export default class Gd_testupload extends LightningElement {
    @api recordId;
    isLoading=false;
    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        console.log('No. of files uploaded : ' + JSON.stringify(uploadedFiles));
        let docId=uploadedFiles[0].documentId;
        let mimeType=uploadedFiles[0].mimeType;
        let docName=uploadedFiles[0].name;
        this.isLoading=true;
        createFile({documentId: docId,documentName: docName,mimeType: mimeType,contactId: this.recordId}).then(()=>{
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Success",
                  message: "File uploaded to Drive",
                  variant: "success"
                })
              );
        }).then(()=>{
            this.isLoading=false;
            this.dispatchEvent(new RefreshEvent()); 
        }).catch((error)=>{
            alert('ERROR!: '+error.message.body);
        });
    }
}