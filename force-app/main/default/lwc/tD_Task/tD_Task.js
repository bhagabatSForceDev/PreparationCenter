import { api,LightningElement } from 'lwc';
import updateRecord from '@salesforce/apex/TD_Controller.updateRecord';
import deleteRecord from '@salesforce/apex/TD_Controller.deleteRecord';
import ID_FIELD from '@salesforce/schema/To_Do_Item__c.Id';
import STATUS_FIELD from '@salesforce/schema/To_Do_Item__c.Status__c';
export default class TD_Task extends LightningElement {
    @api taskRec;
    isEdit=false;
    isTaskEdit=false;
    newText;
    isTextChanged=false;

    handleSelect(e){
        const ev= new CustomEvent("compsel",{detail: this.taskRec.Id});
        this.dispatchEvent(ev);
        this.isEdit=true;
    }

    @api closeEdit(){
        this.isEdit=false;
        this.isTaskEdit=false;
    }

    get containerClass(){
        if(this.taskRec.Status__c=='Complete'){
            return 'container complete-cls';
        }else{
            return 'container';
        }
    }

    handleStatusChange(e){
        let direction=e.currentTarget.value;
        let newStatus;
        if(direction=='left'){
            if(this.taskRec.Status__c=='In Progress'){
                newStatus='To Do';
            }
            if(this.taskRec.Status__c=='Complete'){
                newStatus='In Progress';
            }
        }
        if(direction=='right'){
            if(this.taskRec.Status__c=='In Progress'){
                newStatus='Complete';
            }
            if(this.taskRec.Status__c=='To Do'){
                newStatus='In Progress';
            }
        }
        // const fields={};
        // fields[ID_FIELD.fieldApiName] = this.taskRec.Id;
        // fields[STATUS_FIELD.fieldApiName] = newStatus;
        
        const fields={'Id':this.taskRec.Id,'Status__c':newStatus};
        const recInp={fields};
        updateRecord({recString: JSON.stringify(fields)}).then(()=>{
            
            const updEvt=new CustomEvent("updated");
            this.dispatchEvent(updEvt);
            this.closeEdit();
        }).catch((error)=>{
            console.error(JSON.stringify(error));
            
        });
    }

    handleDblClick(e){
        this.newText=this.taskRec.Task__c;
        this.isTaskEdit=true;
        this.isTextChanged=false;
    }

    handleTextChange(e){
        this.newText=e.detail.value;
        if(e.detail.value != this.taskRec.Task__c){
        this.isTextChanged=true;
        }else{
        this.isTextChanged=false;    
        }
    }

    handleSave(){
        const fields={'Id':this.taskRec.Id,'Task__c':this.newText};
        const recInp={fields};
        if(this.isTextChanged){
        updateRecord({recString: JSON.stringify(fields)}).then(()=>{
            
            const updEvt=new CustomEvent("updated");
            this.dispatchEvent(updEvt);
            this.closeEdit();
        }).catch((error)=>{
            console.error(JSON.stringify(error));
            
        });
        }else{
            this.closeEdit();
        }
    }


    handleDelete(){
        
        deleteRecord({recId:this.taskRec.Id}).then(()=>{
            
            const updEvt=new CustomEvent("updated");
            this.dispatchEvent(updEvt);
        }).catch((error)=>{
            console.error(JSON.stringify(error));
            
        });
    }
}