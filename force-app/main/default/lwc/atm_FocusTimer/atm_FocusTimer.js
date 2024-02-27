import { LightningElement } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class Atm_FocusTimer extends LightningElement {

    foundTime=false;
    storedTime;
    timerId;
    timeRemaining;
    timeHours='00';
    timeMinutes='00';
    timeSeconds='00';

    

    connectedCallback(){
        this.getTimerLogic();
    }
    
    getTimerLogic(){
        let timerVal = sessionStorage.getItem('atm_timer');
        console.log('timerVal->'+timerVal);
        if(timerVal && timerVal!='null' && timerVal!='' && timerVal!='undefined'){
            console.log('FOUND TIME'+timerVal);
            this.storedTime=Date.parse(timerVal);
            this.timerId=setInterval(() => {
                this.timeRemaining=this.storedTime-new Date();
                let hours=Math.floor(this.timeRemaining/3600000);
                let minutes=Math.floor((this.timeRemaining-(hours)*3600000)/60000);
                let seconds=Math.floor((this.timeRemaining-(hours)*3600000-(minutes)*60000)/1000);
                this.timeHours=hours<10?'0'+hours:hours;
                this.timeMinutes=minutes<10?'0'+minutes:minutes;
                this.timeSeconds=seconds<10?'0'+seconds:seconds;
                //console.log('timeSeconds:'+this.timeSeconds);
                this.foundTime=true;
                if(this.timeRemaining<=0){
                    sessionStorage.setItem('atm_timer',null);
                    clearInterval(this.timerId);
                    this.dispatchEvent(new CustomEvent('focuscomplete'));
                    alert('COUNTDOWN COMPLETED');
                    this.foundTime=false;
                }
            }, 1000);
            
        }
    }

    handleTimerStart(e){
        let inputCmp=this.template.querySelector(".input");
        let valid=inputCmp.reportValidity();
        console.log('valid:'+valid);
        if(valid){
        let timeVal=inputCmp.value;
        console.log(timeVal);
        let focusTimeVal=new Date(new Date().getTime()+timeVal*60000);
        console.log('STORING focusTimeVal:'+focusTimeVal);
        sessionStorage.setItem('atm_timer',focusTimeVal);
        console.log('GET VAL:'+sessionStorage.getItem('atm_timer'));
        this.getTimerLogic();
        this.foundTime=true;
        }
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