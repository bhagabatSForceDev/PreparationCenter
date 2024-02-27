import { wire,LightningElement } from 'lwc';
import getEducationList from '@salesforce/apex/PortfolioController.getEducation';
export default class Pf_education extends LightningElement {

educationList=[];

months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    @wire(getEducationList) educationListgetter(result){
        console.log('typeof(result)',typeof(result));
        this.educationList=[];
        if(result.data){
            result.data.forEach((i)=>{
                console.log('EDU:'+JSON.stringify(i));
                console.log('typeof i.Passing_Date__c:'+typeof(i.Passing_Date__c));
                let d=new Date(i.Passing_Date__c);
                console.log('Date d:'+d);
                this.educationList.push({...i,passingDate: `${this.months[d.getMonth()]}-${d.getFullYear()}`});
            
            });
        }else{
            console.error('ERROR @Education Comp:'+JSON.stringify(result.error));
        }
    }
}