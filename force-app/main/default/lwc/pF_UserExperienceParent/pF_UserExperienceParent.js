import { LightningElement, wire } from 'lwc';
import getContactDetails from '@salesforce/apex/PortfolioController.getContactDetails';
export default class PF_UserExperienceParent extends LightningElement {


contactDetails;
windowSize;

connectedCallback(){
    this.resizeHandler();
    window.addEventListener('resize',this.resizeHandler);
}

resizeHandler(){
    
    this.windowSize=window.innerWidth;
    // console.log('WINDOW RESIZED: ',this.windowSize);
}

@wire(getContactDetails) contactDet({error,data}){
    if(data){
        this.contactDetails=data;
        console.log('this.contactDetails: ',JSON.stringify(this.contactDetails));
    }
}

get isLargeDevice(){
    console.log('IN GETTER');
    return this.windowSize>650;
}



}