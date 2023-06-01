import { wire,LightningElement,api } from 'lwc';
import { createRecord,updateRecord  } from 'lightning/uiRecordApi';
import LightningAlert from 'lightning/alert';
import LightningConfirm from 'lightning/confirm';
import {CurrentPageReference} from 'lightning/navigation';
import getQuestion from '@salesforce/apex/PC_Utils.getQuestionDetails';
import updateQuestion from '@salesforce/apex/PC_Utils.updateQuestion';
import deleteQuestion from '@salesforce/apex/PC_Utils.deleteQuestion';
export default class PC_AddQuestionHome extends LightningElement {

    isEdit=false;
    summary;
    question;
    answer;
    @api questionNum;
    questionId;
    isError=false;

    
    
    formats=['font','size','bold','italic','underline','strike','list','indent','align','link','image','clean','table',
                'header','color','background','code','code-block','script','blockquote','direction'];

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
                    }else{
                        this.isError=true;
                    }
                    
                }).then(()=>{
                    this.isEdit=false;
                }).catch(error=>{
                    this.isError=true;
                    console.error('Get Question Error: '+JSON.stringify(error));
                })
                
            }else{
                this.isEdit=true;
            }
        }
    }

    @api invokeGetQuestion(){
        if(this.questionNum){
            getQuestion({questionNum: this.questionNum}).then(result =>{
                console.log('Retrieved Question: '+JSON.stringify(result));
                if(result){
                    this.summary=result.Summary__c;
                    this.question=result.Question_Text__c;
                    this.answer=result.Answer_Text__c;
                    this.questionId=result.Id;
                }else{
                    this.isError=true;
                }
                
            }).then(()=>{
                this.isEdit=false;
            }).catch(error=>{
                this.isError=true;
                console.error('Get Question Error: '+JSON.stringify(error));
            })
            
        }else{
            this.isEdit=true;
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
            console.log('fields:-'+JSON.stringify(fields));
            updateQuestion({q: JSON.stringify(fields)}).then((result)=>{
                console.log('Result: '+JSON.stringify(result));
                LightningAlert.open({
                    message: `Question updated Successfully`,
                    theme: 'success', 
                    label: 'SUCCESS', 
                });
            }).then(this.isEdit=false).catch((error)=>{
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
            return result.fields.Name.value;
        }).then((nameval)=>{
            console.log('nameval: '+nameval);
            window.open(`/prepcenter/?q=${nameval}`,"_self");
        }).catch((error)=>{
            console.error('ERROR: '+JSON.stringify(error));
        });
    }
    }

    handleEdit(){
        this.isEdit=true;
    }

    async handleDelete(){
        const fields={};
        if(this.questionId){
            fields['Id']=this.questionId;
            console.log('fields:-'+JSON.stringify(fields));
            let isdelete= await LightningConfirm.open({
                message: 'Are you sure to delete it?',
                variant: 'headerless',
                label: 'Delete Confirmation'
            });
            console.log('isdelete: ',isdelete);
            if(isdelete){
            deleteQuestion({q: JSON.stringify(fields)}).then((result)=>{
                console.log('Result: '+JSON.stringify(result));
                LightningAlert.open({
                    message: `Question deleted Successfully`,
                    theme: 'success', 
                    label: 'SUCCESS', 
                });
            }).catch((error)=>{
                console.error('ERROR: '+JSON.stringify(error));
            });
        }
        }
    }

    attachYoutube(e){
        console.log(e.currentTarget);
        let yString=`<p><iframe width="485" height="248" src="https://www.youtube.com/embed/5RiZQoULuJ8" title="HOW I Learned Full Stack Web Development in 30 Days?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>`;
        this.answer+=yString;
        console.log('this.answer'+this.answer);
        //e.currentTarget.value+=yString;
    }
}