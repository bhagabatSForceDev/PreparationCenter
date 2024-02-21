import { api,LightningElement } from 'lwc';

export default class Pf_WorkExpSub extends LightningElement {


    @api company='Infosys';
    @api title='Senior Associate Consultant';
    @api fromDate='23/01/2022';
    @api toDate='Present';
    @api details='<span style="font-size: 15px">Sample Description</span><strong>Some more description</strong>';

    get toDispDate(){
        return this.toDate??'Present';
    }

}