global class ScheduledToDoList implements schedulable{
	
    global void execute(SchedulableContext ct){
        To_Do_List__c tdl=[SELECT Id,Home__c,List_Name__c FROM To_Do_List__c WHERE Home__c=true ORDER BY CreatedDate DESC LIMIT 1];
        To_Do_List__c td2= tdl.clone();
        td2.Id=NULL;
        td2.List_Name__c='TO DO LIST - '+DateTime.now().addDays(1).format('dd/MM/yyyy'); 	
        Insert td2;
        List<To_Do_Item__c> tdiList=[SELECT Id,To_Do_List__c,Task__c,Status__c,Priority__c FROM To_Do_Item__c
                                     WHERE To_Do_List__c=:tdl.Id AND Status__c!='Complete'];
        List<To_Do_Item__c> tdiList2=tdiList.clone();
        for(To_Do_Item__c tdi: tdiList2){
            tdi.To_Do_List__c=td2.Id;
            tdi.Id=NULL;
            if(tdi.Status__c=='In Progress'){
                tdi.Status__c='To Do';
            }
        }
        Insert tdiList2;
        
    }
    
}