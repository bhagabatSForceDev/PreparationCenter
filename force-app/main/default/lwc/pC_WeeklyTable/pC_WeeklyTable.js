import { LightningElement } from 'lwc';

export default class PC_WeeklyTable extends LightningElement {

    defaultData=[{"id":"1","day":"Monday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""},
    {"id":"2","day":"Tuesday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""},
    {"id":"3","day":"Wednesday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""},
    {"id":"4","day":"Thursday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""},
    {"id":"5","day":"Friday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""},
    {"id":"6","day":"Saturday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""},
    {"id":"7","day":"Sunday","obj1":"","obj2":"","obj3":"","obj4":"","obj5":""}];
    
    data=localStorage.getItem('weeklyData')?localStorage.getItem('weeklyData'): JSON.stringify(this.defaultData);

    columns=[{label:"Day",fieldName:"day",type:"text"},
    {label:"Objective 1",fieldName:"obj1",type:"formattedText",editable:true},
    {label:"Objective 2",fieldName:"obj2",type:"formattedText",editable:true},
    {label:"Objective 3",fieldName:"obj3",type:"formattedText",editable:true},
    {label:"Objective 4",fieldName:"obj4",type:"formattedText",editable:true},
    {label:"Objective 5",fieldName:"obj5",type:"formattedText",editable:true}];


    //[{"id":"1","day":"Monday","obj1":"DSA 1","obj2":"https://trailhead.salesforce.com/content/learn/projects/build-a-discount-approval-process","obj3":"https://www.youtube.com/watch?v=VpGLSTgrT9c&list=PLaGX-30v1lh2QKI-Ud269FUaFiUtebsQ6"},{"id":"2","day":"Tuesday","obj1":"DSA 2","obj2":"https://trailhead.salesforce.com/content/learn/superbadges/superbadge_ap_management_sbu","obj3":"https://www.youtube.com/watch?v=Moo6qYx5_yI&list=PLaGX-30v1lh2QKI-Ud269FUaFiUtebsQ6&index=2"},{"id":"3","day":"Wednesday","obj1":"DSA 3","obj2":"https://trailhead.salesforce.com/content/learn/superbadges/superbadge_ap_troubleshooting_sbu","obj3":"https://www.youtube.com/watch?v=Po9GLoueMJM&list=PLaGX-30v1lh2QKI-Ud269FUaFiUtebsQ6&index=3"},{"id":"4","day":"Thursday","obj1":"DSA 4","obj2":"https://trailhead.salesforce.com/content/learn/superbadges/superbadge_ap_specialist","obj3":"https://www.youtube.com/watch?v=3pFECSaY2vo&list=PLaGX-30v1lh2QKI-Ud269FUaFiUtebsQ6&index=4"},{"id":"5","day":"Friday","obj1":"Web Dev Bootcamp","obj2":"https://trailhead.salesforce.com/content/learn/superbadges/superbadge_ap_specialist","obj3":"https://www.youtube.com/watch?v=nbQgv0JEgnQ&list=PLaGX-30v1lh2QKI-Ud269FUaFiUtebsQ6&index=5"},{"id":"6","day":"Saturday","obj1":"Datatable Script Creator","obj2":"https://trailhead.salesforce.com/content/learn/superbadges/superbadge_ap_specialist","obj3":"https://www.youtube.com/watch?v=JOpYeBq6ibQ&list=PLaGX-30v1lh2QKI-Ud269FUaFiUtebsQ6&index=6"},{"id":"7","day":"Sunday","obj1":"","obj2":"","obj3":""}]
    realData;

    get rowData(){
        console.log(JSON.parse(this.data));
        this.realData=JSON.parse(this.data);
        return this.realData;
    }

    handleSave(e){
        console.log('Saving'+JSON.stringify(e.detail));
        let tempData=e.detail.draftValues;
        this.realData.map((item,index,array)=>{
            let tempcell=tempData.find((samp)=>samp.id==item.id);
            for(let key in tempcell){
                item[key]=tempcell[key];
            }
            console.log('ITEM: '+JSON.stringify(item));
            array[index]=item;
            
        });
        console.log('FINAL ARR:'+JSON.stringify(this.realData));
        localStorage.setItem('weeklyData',JSON.stringify(this.realData));

        this.template.querySelector("c-custom-datatable").draftValues = [];
        //return this.realData;
    }
}