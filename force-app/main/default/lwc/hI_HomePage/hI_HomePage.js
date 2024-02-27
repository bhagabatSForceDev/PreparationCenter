import { wire,LightningElement } from 'lwc';
import getAllItems from '@salesforce/apex/HI_Controller.getAllItems';

export default class HI_HomePage extends LightningElement {


    
    columns=[{label: 'Item',fieldName: 'Name',type: 'text'},
             {label: 'Stored in',fieldName: 'Container_Name__c',type: 'text'}];
    
    data=[];
    wiredResults;
    @wire(getAllItems) getAllItemRecords(result){
        this.wiredResults=result;
        if(result.data){
            this.data=result.data;
            console.table(this.data);
        }
        if(result.error){
            console.error(JSON.stringify(result.error));
        }
    }


}