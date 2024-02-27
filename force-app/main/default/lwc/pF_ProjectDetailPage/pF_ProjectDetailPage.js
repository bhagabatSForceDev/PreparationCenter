import { api,wire,LightningElement } from 'lwc';
import {CurrentPageReference,NavigationMixin} from 'lightning/navigation';
import getProjectDetails from '@salesforce/apex/PortfolioController.getProjectDetails';
export default class PF_ProjectDetailPage extends NavigationMixin(LightningElement) {

    @api projectId;
    projectDetails;
    youtubeUrl;

    isYT=false;
    isBtn;

    
    
    @wire(CurrentPageReference) getStateParameters(currentPage){
        if(currentPage.state){
            this.projectId=currentPage.state?.projectId;
        }
    }

    @wire(getProjectDetails,{projectId: '$projectId'}) projectDetails(result){
        if(result.data){
            this.projectDetails=result.data;
            if(this.projectDetails.Demo_URL__c){
                this.isBtn=true;
            }
            if(this.projectDetails.YT_Url__c){
            this.youtubeUrl='https://www.youtube.com/embed/'+this.projectDetails.YT_Url__c.substring(this.projectDetails.YT_Url__c.indexOf('v=')+2,this.projectDetails.YT_Url__c.indexOf('&')==-1?99999:this.projectDetails.YT_Url__c.indexOf('&'));
            console.log('EMBED URL=',this.youtubeUrl);
            this.isYT=true;
            }
            //<iframe width="853" height="480" src="https://www.youtube.com/embed/2mtJsR9xUBU" title="Political Arrogance, Petrol &amp; Hypocrite Actors |  Top 5 of the WEEK" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            console.log('this.projectDetails-> '+JSON.stringify(this.projectDetails));
        }else{
            console.error(JSON.stringify(result.error));
        }
    }

    handleDemo(e){
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": `${this.projectDetails.Demo_URL__c}`
            }
        });
    }

}