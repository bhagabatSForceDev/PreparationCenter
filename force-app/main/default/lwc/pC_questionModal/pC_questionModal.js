import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
    @api content;
    @api questionNum;

    renderedCallback(){
        this.template.querySelector('c-p-c_-add-question-home').invokeGetQuestion();
    }

    handleOkay() {
        this.close('okay');
    }
}