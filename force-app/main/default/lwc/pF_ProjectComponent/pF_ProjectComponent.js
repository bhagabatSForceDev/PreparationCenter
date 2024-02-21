import { LightningElement,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getProjects from '@salesforce/apex/PortfolioController.getProjects'
export default class PF_ProjectComponent extends NavigationMixin(LightningElement) {


projList;    
wiredResult;    
@wire(getProjects) getProjectDetails(result){
    if(result.data){
        this.wiredResult=result;
        this.projList=result.data;
        console.log(JSON.stringify('this.projList-->'+JSON.stringify(this.projList)));
    }else{
        console.error('ERROR: '+JSON.stringify(result.error));
    }
}


handleProjectClick(e){
    console.log('Click event triggered'+e.currentTarget.dataset.id);
    this[NavigationMixin.Navigate]({
        "type": "standard__webPage",
        "attributes": {
            "url": `/project?projectId=${e.currentTarget.dataset.id}`
        }
    });
}

}