import { LightningElement } from 'lwc';
import sendTextMessage from '@salesforce/apex/WhatsappUtils.sendTextMessage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class WhatsappSender extends LightningElement {
    options=[{label:'Text',value:'Text'},{label:'Reply',value:'Reply'},{label:'Reaction',value:'Reaction'}];
    
    selectedOption='Text';
    messageContent='';
    phoneNum='918455070614';

    handleOptionSelect(event){
        console.log('CHANGING OPTIONS');
        console.log(event.detail.value);
        this.selectedOption=event.detail.value;
    }

    handleTextChange(event){
        console.log(event.detail.value);
        this.messageContent=event.detail.value;
    }

    handlePhoneChange(event){
        console.log(event.target.value);
        this.phoneNum=event.target.value;
    }

    handleSubmit(){
        sendTextMessage({messageContent: this.messageContent,toPhone:this.phoneNum}).then(()=>{
            console.log('SUCCESS');
            const event = new ShowToastEvent({
                title: 'SUCCESS',
                variant:'success',
                message:
                    'Message sent succesfully!',
            });
            this.messageContent='';
            this.dispatchEvent(event);
        }).catch((error)=>{
            console.error(JSON.stringify(error));
        })
    }
    
}