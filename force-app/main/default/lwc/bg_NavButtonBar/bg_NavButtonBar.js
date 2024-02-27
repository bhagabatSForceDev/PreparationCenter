import { api,LightningElement } from 'lwc';
import {
    FlowNavigationNextEvent,
    FlowNavigationBackEvent,
    FlowAttributeChangeEvent 
} from 'lightning/flowSupport';
export default class Bg_NavButtonBar extends LightningElement {

    @api nav='Normal';

    handleBackToChap(e){
        this.nav='Back';
        const backEvt = new FlowAttributeChangeEvent('nav',this.nav);
        this.dispatchEvent(backEvt);

        const nextEvt = new FlowNavigationNextEvent();
        this.dispatchEvent(nextEvt);
    }

    handlePrev(){
        const prevEvt = new FlowNavigationBackEvent();
        this.dispatchEvent(prevEvt);
    }

    handleNext(){
        const nextEvt = new FlowNavigationNextEvent();
        this.dispatchEvent(nextEvt);
    }
}