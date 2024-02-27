import { LightningElement,api,wire } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import { getRecordCreateDefaults, generateRecordInputForCreate } from "lightning/uiRecordApi";
import {refreshApex} from '@salesforce/apex';
import getChildTasks from '@salesforce/apex/TD_Controller.getChildTasks';
import createRecord from'@salesforce/apex/TD_Controller.createRecord';
import createList from '@salesforce/apex/TD_Controller.createList';
import DEFAULT_LABEL from '@salesforce/label/c.Default_Key';
export default class TD_home extends LightningElement {


    @api recordId;

    toDoList=[];
    toDoListOG=[];
    inProgList=[];
    compList=[];
    isLoading=false;
    listName;
    chartVal;
    isError=false;

    options=[{"label":"Low","value":"Low"},
    {"label":"Medium","value":"Medium"},
    {"label":"High","value":"High"}];

    @wire(getRecordCreateDefaults, { objectApiName: 'To_Do_Item__c' })
    tdiCreateDefaults;

    @wire(getRecordCreateDefaults, { objectApiName: 'To_Do_List__c' })
    tdlCreateDefaults;

    @wire(CurrentPageReference) getPageRef(result){
        console.log('this.recordId');
        if(result){
            this.recordId=this.recordId?this.recordId:result.state?.id;
            console.log('this.recordId');
        }
    }

    get todosize(){
        return this.toDoList.length;
    }

    get inProgsize(){
        return this.inProgList.length;
    }

    get compsize(){
        return this.compList.length;
    }

    chartAttr(){
        console.log('CALLING chartAttr');
        let toDoHigh=0,toDoMed=0,toDoLow=0,inProgHigh=0,inProgMed=0,inProgLow=0,complete=0;
        for(let i of this.toDoListOG){
            if(i.Priority__c=='High')
            toDoHigh++;
            if(i.Priority__c=='Medium')
            toDoMed++;
            if(i.Priority__c=='Low')
            toDoLow++;
        }
        for(let i of this.inProgList){
            if(i.Priority__c=='High')
            inProgHigh++;
            if(i.Priority__c=='Medium')
            inProgMed++;
            if(i.Priority__c=='Low')
            inProgLow++;
        }
        complete=this.compList.length;
        let retVal={toDoHigh:toDoHigh, 
            toDoMed: toDoMed,
            toDoLow: toDoLow,
            inProgHigh: inProgHigh,
            inProgMed: inProgMed,
            inProgLow: inProgLow,
            completed: complete};
        this.chartVal=retVal;
        console.log("CHART VAL="+JSON.stringify(this.chartVal));
    }

    

    get isRecordId(){
        if(this.recordId){
            return true;
        }else{
            return false;
        }
    }

    wiredResults;
    @wire(getChildTasks,{recordId:"$recordId"}) gettingChildTasks(result){
        this.wiredResults=result;
        if(result.data){
            console.log('DATA: '+JSON.stringify(result.data));
            this.toDoList=[];
            this.toDoListOG=[];
            this.inProgList=[];
            this.compList=[];
            let searchele=this.template.querySelector('.search-cls');
            searchele.value="";
            if(!this.listName){
                this.listName=result.data.TaskName.toUpperCase();
            }
            for(let obj of result.data.childTasks){
                if(this.recordId==DEFAULT_LABEL){
                    this.recordId=obj.To_Do_List__c;
                }
                
                if(obj.Status__c=='To Do'){
                    this.toDoList.push(obj);
                    this.toDoListOG.push(obj);
                }
                if(obj.Status__c=='In Progress'){
                    this.inProgList.push(obj);
                }
                if(obj.Status__c=='Complete'){
                    this.compList.push(obj);
                }
            }
            this.chartAttr();
            this.isLoading=false;
        }else if(result.error){
            this.isError=true;
            console.error('ERROR @ TD_home:'+JSON.stringify(result.error));
        }
    }


    handleCompSel(e){
        console.log('COMPONENT SELECTED: '+JSON.stringify(e.detail));
        let allNonSelComps=this.template.querySelectorAll('c-t-d_-task');
        for(let i=0;i<allNonSelComps.length;i++){
            if(e.detail!=allNonSelComps[i].getAttribute('data-id'))
            allNonSelComps[i].closeEdit();
        }
    }


    handleRefresh(e){
        console.log('REFRESHING...');
        this.isLoading=true;
        return refreshApex(this.wiredResults);
    }

    handlePickValSel(e){
        console.log('SELECTED: '+e.currentTarget.value);
    }

    handleAddTask(e){
        let taskName=this.template.querySelector('[data-id="TaskName"]').value;
        let taskPriority=this.template.querySelector('[data-id="TaskPriority"]').value;

        const tdiObjectInfo = this.tdiCreateDefaults.data.objectInfos['To_Do_Item__c'];
        const recordDefaults = this.tdiCreateDefaults.data.record;
        const recordInput = generateRecordInputForCreate(recordDefaults, tdiObjectInfo);
        recordInput.fields['Task__c']=taskName;
        recordInput.fields['Priority__c']=taskPriority;
        recordInput.fields['Status__c']='To Do';
        recordInput.fields['To_Do_List__c']=this.recordId;
        console.log('recordInput='+JSON.stringify(recordInput));

        
        createRecord({recString: JSON.stringify(recordInput.fields)}).then(()=>{
            this.handleRefresh();
        }).catch(error=>{
            console.error(JSON.stringify(error));
        });

        console.log(`${taskName} ${taskPriority}`);
        this.template.querySelector('[data-id="TaskName"]').value=null;
        this.template.querySelector('[data-id="TaskPriority"]').value='Low';
    }

    handleCreateList(e){
        let listName=this.template.querySelector('[data-id="ListName"]').value;
        // const tdlObjectInfo = this.tdlCreateDefaults.data.objectInfos['To_Do_Item__c'];
        // const recordDefaults = this.tdlCreateDefaults.data.record;
        // const recordInput = generateRecordInputForCreate(recordDefaults, tdlObjectInfo);
        // recordInput.fields['List_Name__c']=listName;
        if(listName){
        createList({listName: listName}).then((id)=>{
            console.log('CREATED RECORD:'+JSON.stringify(id));
            window.open('/prepcenter/to-do-list?id='+id);
        }).catch(error=>{
            console.error(JSON.stringify(error));
        });
        }
    }


    handleToDoChange(e){
        console.log(e.currentTarget.value);
        let searchval=e.currentTarget.value.toLowerCase();
        this.toDoList=this.toDoListOG.filter((ele)=>{
            if(ele.Task__c.toLowerCase().includes(searchval)){
                return true;
            }else{
                return false;
            }
        });
        console.log('AFTER SEARCH: '+JSON.stringify(this.toDoList));
    }

}