import { wire,LightningElement } from 'lwc';
import getSkills from '@salesforce/apex/PortfolioController.getSkills';
export default class Pf_skillComponent extends LightningElement {

    
    technicalSkills=[];
    tools=[];
    softSkills=[];
    isLoaded=false;
    
    @wire(getSkills) getSkillValues(result){
        if(result.data){
            console.log('DATA: '+JSON.stringify(result.data));
            result.data.forEach((ele)=>{
                if(ele.Section__c=='Tools')
                    this.tools.push(ele);
                if(ele.Section__c=='Technical Skills')
                    this.technicalSkills.push(ele);
                if(ele.Section__c=='Soft Skills')
                    this.softSkills.push(ele);

                this.isLoaded=true;
            });
        }else{
            console.log('ERROR: '+JSON.stringify(result.error));
        }
    }
}