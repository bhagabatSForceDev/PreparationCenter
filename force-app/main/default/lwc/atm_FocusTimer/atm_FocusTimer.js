import { LightningElement } from 'lwc';

export default class Atm_FocusTimer extends LightningElement {

    foundTime=false;
    storedTime;
    timerId;
    timeRemaining;
    timeHours;
    timeMinutes;
    timeSeconds;

    

    connectedCallback(){
        this.getTimerLogic();
    }
    
    getTimerLogic(){
        let timerVal = sessionStorage.getItem('atm_timer');
        if(timerVal!='null' && timerVal!='' && timerVal!='undefined'){
            console.log('FOUND TIME'+timerVal);
            this.storedTime=Date.parse(timerVal);
            this.timerId=setInterval(() => {
                this.timeRemaining=this.storedTime-new Date();
                let hours=Math.floor(this.timeRemaining/3600000);
                let minutes=Math.floor((this.timeRemaining-(this.timeHours)*3600000)/60000);
                let seconds=Math.floor((this.timeRemaining-(this.timeHours)*3600000-(this.timeMinutes)*60000)/1000);
                this.timeHours=hours<10?'0'+hours:hours;
                this.timeMinutes=minutes<10?'0'+minutes:minutes;
                this.timeSeconds=seconds<10?'0'+seconds:seconds;
                if(this.timeRemaining<=0){
                    sessionStorage.setItem('atm_timer',null);
                    clearInterval(this.timerId);
                    this.foundTime=false;
                }
            }, 1000);
           this.foundTime=true; 
        }
    }

    handleTimerStart(e){
        let inputCmp=this.template.querySelector(".input");
        inputCmp.reportValidity();

        let timeVal=inputCmp.value;
        console.log(timeVal);
        let focusTimeVal=new Date(new Date().getTime()+timeVal*60000);
        console.log('STORING focusTimeVal:'+focusTimeVal);
        sessionStorage.setItem('atm_timer',focusTimeVal);
        console.log('GET VAL:'+sessionStorage.getItem('atm_timer'));
        this.getTimerLogic();
        this.foundTime=true;
    }

    handleCancel(){
        sessionStorage.setItem('atm_timer',null);
                    clearInterval(this.timerId);
                    this.foundTime=false;
    }

    handleBlur(event) {
        let input = this.template.querySelector(".input");
        console.log(input.validity.valid); //returns true
    }

}