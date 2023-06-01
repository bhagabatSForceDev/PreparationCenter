import { wire,LightningElement } from 'lwc';
import getAllQuestions from '@salesforce/apex/PC_Utils.getAllQuestions';
import pcModal from 'c/pC_questionModal';
export default class PC_questionsTable extends LightningElement {

    columns=[{label:"Question Number", fieldName:"questionLink",type:"url",
                typeAttributes: { tooltip: { fieldName: 'questionLink' }, label: {fieldName: 'Name'}, target: '_self'}},
            {label:"Summary", fieldName:"Summary__c",type:"text"},
            {label:"Open",type:"button",typeAttributes:{variant:'brand',name:'openQuestion',label:'View'}}];

    data=[];
    actualData;
    wiredResult;
    @wire(getAllQuestions) allQuestions(result){
        if(result.data){
            console.table(result.data);
            //console.log(JSON.stringify(result.data));
            this.wiredResult=result.data;
            this.data=[...result.data];
            this.data.map((curr, index, arr)=>{
                try{
                console.log('curr:'+JSON.stringify(curr));
                console.log('index:'+index);
                //console.log('arr:'+arr);
                arr[index]={...curr,"questionLink":`https://bhagabat-lwc-dev-dev-ed.develop.my.site.com/prepcenter/?q=${curr.Name}`};
                
                }catch(error){console.error('ERROR:'+JSON.stringify(error.message))};
                
            });
            this.actualData=[...this.data];
            console.log(JSON.stringify(result.data));
        }
    }

    handleRowAction(e){
        console.log('ACTION:',JSON.stringify(e.detail));
        let action=e.detail.action.name;
        let qnum=e.detail.row.Name;
        switch(action){
            case "openQuestion":{
                pcModal.open({
                    content: 'Test Content',
                    questionNum: qnum
                });
            }
        }
    }

    handleSearch(e){
        console.log('Searching for: ',e.detail.value);
        let searchVal=e.detail.value;
        this.data=this.actualData.filter((curr,index,arr)=>{
            if(curr.Summary__c.toLowerCase().includes(searchVal.toLowerCase())){
                return true;
            }else{
                return false;
            }
        });
    }

    handleCreateQuestion(){
        pcModal.open({
            content: 'Test Content',
            questionNum: null
        });
    }
}