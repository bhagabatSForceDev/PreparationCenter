import { wire,LightningElement } from 'lwc';
import profilePic from '@salesforce/resourceUrl/ProfilePic';
import Icons from '@salesforce/resourceUrl/Icons';
import getSocialMedia from '@salesforce/apex/PortfolioController.getSocialMedia';
import getContactDetails from '@salesforce/apex/PortfolioController.getContactDetails';
export default class PF_HeadComponent extends LightningElement {

    textHeader=`Header: (ETA 8th June)
    A light mode dark mode switch.
    Changes component themes using LMS.
    Profile Pic
    Background of starry sky based on theme
    Connections. (Linkedin, etc.)`;

    //sampleShortDesc='';

    sampleDesc='';

    profPic;

    renderedCallback(){
        this.profPic=profilePic;
        console.log('IMAGE URL:',profilePic);
        if(this.contactDetails.data){
            console.log('this.sampleDesc: ',this.sampleDesc);
            this.template.querySelector('.description-box').innerHTML=this.contactDetails.data.Description;
            //this.sampleShortDesc=this.contactDetails.data.Summary__c;
        }
    }

    get sampleShortDesc(){
        if(this.contactDetails.data){
            this.template.querySelector('.description-box').innerHTML=this.contactDetails.data.Description;
            return this.contactDetails.data.Summary__c;
        } 
    }

    @wire(getSocialMedia) socialMediaList;

    @wire(getContactDetails) contactDetails;

    get socialList(){
        let retArr=[];
        
        console.log('this.socialMediaList: ',JSON.stringify(this.socialMediaList));
        if(this.socialMediaList.data){
        let lastIndex=this.profPic.lastIndexOf("/");
        let uriSub=this.profPic.substring(0,lastIndex);
        this.socialMediaList.data.map((item,index,arr)=>{
            let compUrl={...item,imgUrl:`${Icons}/Icons/${item.iconUrl}.png`};
            console.log('compUrl: ',JSON.stringify(compUrl));
            retArr.push(compUrl);
        });
        }
        return retArr;
    }
}