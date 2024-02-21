import { api  } from 'lwc';
import LightningModal from 'lightning/modal';
import addEvent from '@salesforce/apex/GoogleCalendarAPI.addEvent';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class Gc_AddEventToday extends LightningModal {
    @api content;
    summary='';
    startTime;
    endTime;

    handleSave() {
        console.log('this.summary: '+this.summary);
        console.log('this.startTime: '+this.startTime);
        console.log('this.endTime: '+this.endTime);

        if(this.summary=='' || !this.startTime || !this.endTime){
            alert('Invalid Details');
        }else{
            addEvent({summary: this.summary,startTime: this.startTime,endTime: this.endTime}).then((res)=>{
                if(res=='200'){
                    this.dispatchEvent(
                        new ShowToastEvent({
                          title: "Success",
                          message: "Added Event to Calendar",
                          variant: "success"
                        })
                      );
                    this.close('Completed in GMAIL');
                }
            })
        }
        
    }

    handleSummChange(e){
        this.summary=e.currentTarget.value;
    }

    handleStartChange(e){
        this.startTime=e.currentTarget.value;
    }

    handleEndChange(e){
        this.endTime=e.currentTarget.value;
    }
}