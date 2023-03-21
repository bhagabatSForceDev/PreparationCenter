import { wire,LightningElement } from 'lwc';
import { createRecord,updateRecord  } from 'lightning/uiRecordApi';
import LightningAlert from 'lightning/alert';
import {CurrentPageReference} from 'lightning/navigation';
import getQuestion from '@salesforce/apex/PC_Utils.getQuestionDetails';
export default class PC_AddQuestionHome extends LightningElement {

    isEdit=true;
    summary;
    question;
    answer;
    questionNum;
    questionId;

    @wire(CurrentPageReference) pageStateRef(pageParams){
        console.log('pageParams: '+ JSON.stringify(pageParams));
        if(pageParams){
            this.questionNum=pageParams.state?.q;
            if(this.questionNum){
                getQuestion({questionNum: this.questionNum}).then(result =>{
                    console.log('Retrieved Question: '+JSON.stringify(result));
                    if(result){
                        this.summary=result.Summary__c;
                        this.question=result.Question_Text__c;
                        this.answer=result.Answer_Text__c;
                        this.questionId=result.Id;
                    }
                    
                }).then(()=>{
                    this.isEdit=false;
                }).catch(error=>{
                    console.error('Get Question Error: '+JSON.stringify(error));
                })
                
            }
        }
    }


    handleChange(e){
        console.log('Changed -- '+e.currentTarget.label+ ' Val -- '+e.currentTarget.value);
        switch (e.currentTarget.label) {
            case 'Summary':
                this.summary=e.currentTarget.value;
                break;
            case 'Question':
                this.question=e.currentTarget.value;
                break;
            case 'Answer':
                this.answer=e.currentTarget.value;
                break;
            default:
                break;
        }
    }


    handleSave(){
        const fields={};
        fields['Summary__c']=this.summary;
        fields['Question_Text__c']=this.question;
        fields['Answer_Text__c']=this.answer;
        fields['Question_Type__c']='Text';
        fields['Subject__c']='Interview';
        if(this.questionId){
            fields['Id']=this.questionId;
        }
        const recordInp={apiName: 'Question__c',fields};
        const recInp={fields};
        
        console.log(JSON.stringify(recordInp));
        if(this.questionId){
            updateRecord(recInp).then((result)=>{
                console.log('Result: '+JSON.stringify(result));
                LightningAlert.open({
                    message: `Question updated Successfully`,
                    theme: 'success', 
                    label: 'SUCCESS', 
                });
            }).catch((error)=>{
                console.error('ERROR: '+JSON.stringify(error));
            });
        }else{
        createRecord(recordInp).then((result)=>{
            console.log('Result: '+JSON.stringify(result));
            LightningAlert.open({
                message: `Question ${result.fields.Name.value} Created Successfully`,
                theme: 'success', 
                label: 'SUCCESS', 
            });
        }).catch((error)=>{
            console.error('ERROR: '+JSON.stringify(error));
        });
    }
    }

    handleEdit(){
        this.isEdit=true;
    }
}