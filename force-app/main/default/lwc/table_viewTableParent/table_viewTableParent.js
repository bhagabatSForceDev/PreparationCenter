import { wire,LightningElement } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import getTableData from '@salesforce/apex/TableUtils.getTableData';
import createRow from '@salesforce/apex/TableUtils.createRow'
import saveRows from '@salesforce/apex/TableUtils.saveRows';
export default class Table_viewTableParent extends LightningElement {

tableId;
showSpinner=false;
columns;

rowData=[];


    @wire(CurrentPageReference) getPageparams(result){
        this.showSpinner=true;
        if(result){
            this.tableId=result.state?.tableid;
            if(this.tableId){
                console.log('in this.tableId');
                this.handleGetData();
            }
        }
    }


    handleGetData(){
        console.log('INSIDE getTableData');
        getTableData({tableId: this.tableId}).then((result)=>{
            console.log('RESULT: '+JSON.stringify(result));
            this.columns=JSON.parse(result.column);
            this.rowData=[];
            console.log('this.columns: '+JSON.stringify(this.columns));
            // let rowStr='[';
            // for(let str of JSON.parse(result.rowData)){
            //     rowStr=str+',';
            // }
            // rowStr=rowStr.substring(0,rowStr.length-1);
            // rowStr+=']';
            for(let str of result.rowData){
                    this.rowData.push(JSON.parse(str));
                }
            
            console.log('this.rowData: '+JSON.stringify(this.rowData));
            this.showSpinner=false;
        }).catch((error)=>{
            console.error('ERROR: '+error.message);
        });
    }

    addRow(){
        this.showSpinner=true;
        createRow({tableId: this.tableId}).then((result)=>{
            console.log('ADD ROW: '+JSON.stringify(result));
        }).then(()=>{
            this.handleGetData();
        })
    }


    handleSave(e){
        //this.showSpinner=true;
        console.log('Saving'+JSON.stringify(e.detail));
        let arr=[];
        let draftVal=e.detail.draftValues;
        draftVal.map((curr)=>{
            arr.push({index: curr["index"],data: curr});
        });

        saveRows({editedData: JSON.stringify(arr), tableId: this.tableId}).then((result)=>{
            console.log('RESULT: '+result);
            if(result=='true'){
                this.template.querySelector("lightning-datatable").draftValues = [];
                this.handleGetData();
            }else{
                console.error(result);
            }
        })
        console.log('Saving values: '+ JSON.stringify(arr));
    }

    
}