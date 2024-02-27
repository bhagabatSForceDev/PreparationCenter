import { api,LightningElement } from 'lwc';

export default class PF_Summary extends LightningElement {

    @api summaryText;

    get summText(){
        return this.summaryText??'SOMETHING WENT WRONG..';
    }
}