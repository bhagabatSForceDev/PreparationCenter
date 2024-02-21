import { LightningElement,wire } from 'lwc';
import getWorkExperiences from '@salesforce/apex/PortfolioController.getWorkExperiences';

export default class PF_WorkExp extends LightningElement {

    workExpList;
    passedOnList;

    @wire(getWorkExperiences) workExperienceMethod(result){
        if(result.data){
            this.workExpList=result.data;
            this.passedOnList=[];
            this.workExpList.forEach(ele => {
                this.passedOnList.push({company: ele.Company__c,
                                        title: ele.Title__c, 
                                        fromDate: ele.From_Date__c,
                                        toDate: ele.To_Date__c,
                                        details: ele.Description__c});
            });
            console.log('this.passedOnList: ',JSON.stringify(this.passedOnList));
        }else{
            console.error('WORK EXPERIENCE ERROR: ',JSON.stringify(result.error));
        }
    }
}