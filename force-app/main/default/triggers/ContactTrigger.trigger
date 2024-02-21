trigger ContactTrigger on Contact (before insert) {
	
    if(Trigger.isInsert && Trigger.isBefore){
       // Get all Contacts
       List<Contact> allContacts=[SELECT Id,Name,Email FROM Contact];
       Map<String,Boolean> keyExists= new Map<String,Boolean>();
        for(Contact con: allContacts){
            String key=con.Name+'-'+con.Email;
            keyExists.put(key,true);
        }
        for(Contact con: trigger.new){
            //Name field is not available on Contact before insert as it is compound field.
            String key=con.FirstName+' '+con.LastName+'-'+con.Email;
            if(keyExists.containsKey(key)){
                //con.addError('Name and Email combination must be unique');
            }
        }
    }
    
}