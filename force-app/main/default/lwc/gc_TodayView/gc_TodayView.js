import { wire,LightningElement } from 'lwc';
import getTodayEvents from '@salesforce/apex/GoogleCalendarAPI.getEventsToday';
import editEvent from '@salesforce/apex/GoogleCalendarAPI.editEvent';
import deleteEvent from '@salesforce/apex/GoogleCalendarAPI.deleteEvent'
import { refreshApex } from "@salesforce/apex";
import addModal from 'c/gc_AddEventToday';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const actions = [
    { label: 'Delete', name: 'delete' }
];

const columns=[{label: 'Event Name',fieldName: 'summary',type: 'text'},
{label: 'Starts at',fieldName: 'xstart.dateString',type: 'date',editable: true,typeAttributes:{
    hour: "2-digit",
    minute: "2-digit"
}},
{label: 'Ends at',fieldName: 'xend.dateString',type: 'date',editable: true,typeAttributes:{
    hour: "2-digit",
    minute: "2-digit"
}},{ type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } }];

export default class Gc_TodayView extends LightningElement {

    isData=false;
    todayEvents;

    columns=columns;

    wiredData;


    @wire(getTodayEvents) todayEvents(result){
        this.wiredData=result;
        this.isData=false;
        if(result.data){
            let tempArr=result.data;
            this.todayEvents=[];
            for(let i=0;i<tempArr.length;i++){
                let samp={...tempArr[i],'xstart.dateString':tempArr[i].xstart.dateString,'xend.dateString':tempArr[i].xend.dateString};
                console.log('samp->'+JSON.stringify(samp));
                this.todayEvents.push(samp);
            }
            
            this.isData=true;
            console.log('FINALVALS: '+JSON.stringify(this.todayEvents,null,2));
        }
    }

    async handleAdd(){
        console.log('INSIDE HANDLE ADD');
        try{
        const result= await addModal.open();
        if(result=='Completed in GMAIL'){
            this.handleRefresh();
        }
        }catch(e){
            console.error(JSON.stringify(e));
        }
        // console.log(result);
    }


    handleEdit(e){
        console.log('EDITED:'+JSON.stringify(e.detail));
        let success=true;
        if(e.detail.draftValues){
            e.detail.draftValues.forEach(ele => {
                let evt = this.todayEvents.find((el)=>{
                    console.log('el.id='+el.id+' ele.id='+ele.id);
                    if(el.id==ele.id)
                        return true;
                    else
                        return false;
                });
                console.log('FOUND evt:'+evt);
                for(let key in evt){
                    if(key in ele){
                        evt[key]=ele[key];
                    }
                }
                console.log('FINAL UPDATE VAL: '+JSON.stringify(evt,null,2));
                let params={eventId: evt.id, summary: evt.summary, startTime:evt["xstart.dateString"], endTime: evt["xend.dateString"]};
                console.log('params: '+JSON.stringify(params));
                editEvent({eventId: evt.id, summary: evt.summary, startTime:evt["xstart.dateString"], endTime: evt["xend.dateString"]}).then((resp)=>{
                    if(resp!='200'){
                        success=false;
                    }
                });
                
            });
            if(success){
                e.target.draftValues=[];
                this.handleRefresh();
                this.dispatchEvent(
                    new ShowToastEvent({
                      title: "Success",
                      message: "Events Edited",
                      variant: "success"
                    })
                  );
            }
        }
        
    }

    handleRowAction(e){
        console.log('DEL:'+JSON.stringify(e.detail,null,2));
        if(e.detail.action.name == 'delete'){
            let evtId = e.detail.row.id;
            deleteEvent({eventId: evtId}).then((resp)=>{
                if(resp=='200'){
                    this.dispatchEvent(
                        new ShowToastEvent({
                          title: "Success",
                          message: "Events Edited",
                          variant: "success"
                        })
                      );
                }
            }).then(()=>{
                this.handleRefresh();
            }).catch((error)=>{
                console.error(error);
            })
        }
    }

   
    handleRefresh(){
        //this.isData=false;
        refreshApex(this.wiredData);
        //this.isData=true;
    }

}