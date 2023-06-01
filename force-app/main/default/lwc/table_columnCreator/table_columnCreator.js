import { LightningElement,api } from 'lwc';

export default class Table_columnCreator extends LightningElement {

isLoading=false;

typeOptions=[{"label":"Text", "value":"text"},
{"label":"Number", "value":"number"},
{"label":"URL", "value":"url"},
{"label":"Currency", "value":"currency"}];


@api columns=[{index:1,set name(value){
    //this.name=value;
    this.label=value;
    this.fieldName=value.replaceAll(/[&\/\\#, +()$~%.'":*?<>{}!]/g,'_');
},type:"",editable: true, get columnName() {return 'Column '+this.index}}];

@api get retColumns(){
    return JSON.stringify(this.columns);
}

createFieldName(value){
    let str=value.replaceAll(/[&\/\\#, +()$~%.'":*?<>{}!]/g,'_');
    return str;
}

handleNameChange(event){
    
    console.log('Event value: '+JSON.stringify(event.detail.value));
    console.log('Event key: '+JSON.stringify(event.currentTarget.dataset.key));
    try {
        this.columns.map((curr,index,arr)=>{
            if(curr.index==event.currentTarget.dataset.key){
                arr[index]['name']=event.detail.value;
            }
        });
    } catch (error) {
        console.error(error.message);
    }
    
    console.log('this.columns: '+JSON.stringify(this.columns));
}

handleTypeSelect(event){
    
    console.log('Event value: '+JSON.stringify(event.detail.value));
    console.log('Event key: '+JSON.stringify(event.currentTarget.dataset.key));
    this.columns.map((curr,index,arr)=>{
        if(curr.index==event.currentTarget.dataset.key){
            arr[index]['type']=event.detail.value;
        }
    });
    console.log('this.columns: '+JSON.stringify(this.columns));
}

addColumn(){
    this.isLoading=true;
    this.columns.push({index:this.columns.length+1,set name(value){
        //this.name=value;
        this.label=value;
        this.fieldName=value.replaceAll(/[&\/\\#, +()$~%.'":*?<>{}!]/g,'_');
    },type:"",editable: true, get columnName() {return 'Column '+this.index}});
    this.isLoading=false;
}

@api validate() {
this.columns.forEach((curr)=>{
    if(curr.name==null || curr.type==null){
        console.error('curr.name,curr.type: ',curr.name,curr.type);
        return {
                    isValid: false, 
                    errorMessage: 'Need all the fields to be populated'
                }
    }else{
        return { isValid: true };
    }
}
)
}
}