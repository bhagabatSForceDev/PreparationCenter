public class WhatsappMessage {

    public String WAobject;	//whatsapp_business_account
	public entry[] entry;
	public class entry {
		public String id;	//102064669453522
		public changes[] changes;
	}
	public class changes {
		public value value;
		public String field;	//messages
	}
	public class value {
		public String messaging_product;	//whatsapp
		public metadata metadata;
		public contacts[] contacts;
		public messages[] messages;
	}
	public class metadata {
		public String display_phone_number;	//15550409541
		public String phone_number_id;	//116464824664809
	}
	public class contacts {
		public profile profile;
		public String wa_id;	//918455070614
	}
	public class profile {
		public String name;	//Bhagabat
	}
	public class messages {
		public String fromId;	//918455070614
		public String id;	//wamid.HBgMOTE4NDU1MDcwNjE0FQIAEhggMjMzM0M3QUI4QzM5MDEwMzMyQjM5NkM3RTI3MzE4NjgA
		public String timestamp;	//1673672967
		public String typeVal;	//image
        public text text;
		public image image;
        public reaction reaction;
        public context context;
	}
    
    public class context{
        public string fromId;
        public string id;
    }
    
    public class text{
        public String body;
    }
    
	public class image {
		public String mime_type;	//image/jpeg
		public String sha256;	//VgVs4X8eIsuL8MZVAoCcptGzGLtAjQ1WSyuPfL9tilQ=
		public String id;	//486685656973474
	}
    
    public class reaction {
        public string emoji;
        public string message_id;
    }
    
	public static WhatsappMessage parse(String json){
		return (WhatsappMessage) System.JSON.deserialize(json, WhatsappMessage.class);
	}
    
    public static void createMessageRecord(WhatsappMessage wm){
        WA_Message__c createRec= new WA_Message__c();
        List<WhatsappMessage.entry> wsEntryList=wm.entry;
        createRec.External_Id__c=wsEntryList[0].id;
        
        List<WhatsappMessage.changes> changesList= wsEntryList[0].changes;
        
        WhatsappMessage.value wValue=changesList[0].value;
        
        List<WhatsappMessage.contacts> wcontacts=wValue.contacts;
        if(wValue.contacts!=null && wValue.contacts.size()>0){
        createRec.Profile_Name__c=wcontacts[0].profile.Name;
        createRec.WA_Id__c=wcontacts[0].wa_id;
        createRec.Contact__c=getContact(wcontacts[0].wa_id,wcontacts[0].profile.Name);    
        }
        
        List<WhatsappMessage.messages> msgList=wValue.messages;
        if(msgList!=null && msgList.size()>0){
           createRec.Sent_Time__c=System.now();
           createRec.Message_Content__c=msgList[0].text!=null?msgList[0].text.body:null;
           system.debug('msgList[0]: '+msgList[0]);
           createRec.Type__c=msgList[0].typeVal;
           createRec.Media_Type__c=msgList[0].image!=null?msgList[0].image.mime_type:null;
           createRec.Media_Id__c= msgList[0].image!=null?msgList[0].image.id:null;
           createRec.Message_Id__c=msgList[0].id;
           createRec.Is_Context__c=msgList[0].context!=null?true:false;
           createRec.Reaction__c=msgList[0].reaction!=null?msgList[0].reaction.emoji:null;
            if(msgList[0].context!=null){
                createRec.Parent_Message_Id__c=msgList[0].context.id;
            }else if(msgList[0].reaction!=null){
                createRec.Reaction__c=msgList[0].reaction.emoji;
            }
        }
        
        if(createRec.WA_Id__c!=null){
        Insert createRec;
        }
        
    }
    
    public static String getContact(String wa_id,String profName){
        Contact con=[SELECT Id,WA_Id__c FROM Contact WHERE WA_Id__c=: wa_id LIMIT 1];
        if(con==null){
            Contact newCon= new Contact();
            newCon.FirstName=profName;
            newCon.WA_Id__c=wa_id;
            Insert newCon;
            return newCon.Id;
        }else{
            return con.Id;
        }
    }
}