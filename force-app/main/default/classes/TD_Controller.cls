public without sharing class TD_Controller {
    
   
    @AuraEnabled(cacheable=true)
    public static TaskAndChild getChildTasks(String recordId){
        String listName='';
        if(recordId==System.Label.Default_Key){
            To_Do_List__c tdl=[SELECT Id,Home__c,List_Name__c FROM To_Do_List__c WHERE Home__c=true ORDER BY CreatedDate DESC LIMIT 1];
            recordId=tdl.Id;
            listName=tdl.List_Name__c;
        }else{
            To_Do_List__c tdl=[SELECT Id,Home__c,List_Name__c FROM To_Do_List__c WHERE Id=:recordId LIMIT 1];
            listName=tdl.List_Name__c;
        }
        List<To_Do_Item__c> childTaksList=[SELECT Id,Name,Status__c,Priority__c,To_Do_List__c,Task__c,To_Do_List__r.List_Name__c FROM To_Do_Item__c
         WHERE To_Do_List__c=: recordId ORDER BY Priority__c ASC, Task__c ASC];
        
         TaskAndChild retVal= new TaskAndChild();
         retVal.TaskName=listName;
         retVal.childTasks=childTaksList;

         return retVal;
    }


    @AuraEnabled
    public static Id createList(String listName){
        try {
            To_Do_List__c td= new To_Do_List__c();
            td.List_Name__c=listName;
            Insert td;

            return td.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createRecord(String recString){
        try {
            Boolean isHome=false;
            if(recString.containsIgnoreCase(System.Label.Default_Key)){
                isHome=true;
                recString.replaceAll(System.Label.Default_Key,'');
            }
            To_Do_Item__c td=(To_Do_Item__c)JSON.deserialize(recString,To_Do_Item__c.class);
            
            if(isHome){
            To_Do_List__c tdl=[SELECT Id,Home__c FROM To_Do_List__c WHERE Home__c=true ORDER BY CreatedDate DESC LIMIT 1];
            td.To_Do_List__c=tdl.Id;
            }

            insert td;
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateRecord(String recString){
        try {
            To_Do_Item__c td=(To_Do_Item__c)JSON.deserialize(recString,To_Do_Item__c.class);
            update td;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteRecord(String recId){
        try {
            To_Do_Item__c td=new To_Do_Item__c();
            td.Id=recId;
            delete td;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class TaskAndChild{
        @AuraEnabled public string TaskName;
        @AuraEnabled public List<To_Do_Item__c> childTasks;
    }
}