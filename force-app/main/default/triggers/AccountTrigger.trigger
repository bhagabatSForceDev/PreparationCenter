trigger AccountTrigger on Account (before insert,after insert,before update,after update) {
	
    if(Trigger.isBefore && Trigger.isUpdate){
        List<Account> accountsToClone= new List<Account>();
        
        Map<Integer,Account> indexAccCloneMap= new Map<Integer,Account>();
        Map<Integer,List<Contact>> indexContactCloneMap= new Map<Integer,List<Contact>>();
        Integer count=1;
        List<Account> getChildRecords=[SELECT Id,(SELECT Id,FirstName,LastName,Email,Phone FROM Contacts) FROM Account WHERE Id IN: trigger.newMap.keySet()];
        for(Account acc: getChildRecords){
            if(trigger.oldMap.get(acc.Id).Clone__c ==false && trigger.newMap.get(acc.Id).Clone__c){
                trigger.newMap.get(acc.Id).Clone__c=false;
                indexAccCloneMap.put(count,trigger.newMap.get(acc.Id).clone(false,true,false,false));
                indexContactCloneMap.put(count,acc.Contacts);
                count++;
            }
        }
        Savepoint sp = Database.setSavepoint();
        //List<Account> deepCloneAccList= accountsToClone.deepClone(false,false,false);
        try{
            system.debug('INSERTING indexAccCloneMap.values(): '+indexAccCloneMap.values());
        	Insert indexAccCloneMap.values();
            List<Contact> contactsToBeCreated= new List<Contact>();
            for(Integer i: indexAccCloneMap.keySet()){
                for(Contact con:indexContactCloneMap.get(i)){
                    Contact newCon= con.clone(false,true,false,false);
                    newCon.AccountId=indexAccCloneMap.get(i).Id;
                    contactsToBeCreated.add(newCon);
                }
            }
            system.debug('INSERTING contactsToBeCreated: '+contactsToBeCreated);
            Insert contactsToBeCreated;
        }Catch(Exception e){
            Database.rollback(sp);
        }
    }
    
}