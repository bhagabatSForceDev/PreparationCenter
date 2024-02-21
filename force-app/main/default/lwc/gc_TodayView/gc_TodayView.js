import { wire,LightningElement } from 'lwc';
import getTodayEvents from '@salesforce/apex/GoogleCalendarAPI.getEventsToday';
import { refreshApex } from "@salesforce/apex";
import addModal from 'c/gc_AddEventToday';
const columns=[{label: 'Event Name',fieldName: 'summary',type: 'text'},
{label: 'Starts at',fieldName: 'xstart.dateString',type: 'date',editable: true,typeAttributes:{
    hour: "2-digit",
    minute: "2-digit"
}},
{label: 'Ends at',fieldName: 'xend.dateString',type: 'date',editable: true,typeAttributes:{
    hour: "2-digit",
    minute: "2-digit"
}}];

export default class Gc_TodayView extends LightningElement {

    isData=false;
    todayEvents;

    columns=columns;

    wiredData;


    @wire(getTodayEvents) todayEvents(result){
        this.wiredData=result;
        if(result.data){
            let tempArr=result.data;
            this.todayEvents=[];
            for(let i=0;i<tempArr.length;i++){
                let samp={...tempArr[i],'xstart.dateString':tempArr[i].xstart.dateString,'xend.dateString':tempArr[i].xend.dateString};
                console.log('samp->'+JSON.stringify(samp));
                this.todayEvents.push(samp);
            }
            this.isData=true;
            console.table(this.todayEvents);
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

    handleRefresh(){
        // this.isData=false;
        refreshApex(this.wiredData);
    }

}