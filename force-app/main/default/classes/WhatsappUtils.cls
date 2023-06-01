public class WhatsappUtils {
    
    public String messaging_product;	//whatsapp
	public contacts[] contacts;
	public messages[] messages;
	class contacts {
		public String input;	//918455070614
		public String wa_id;	//918455070614
	}
	class messages {
		public String id;	//wamid.HBgMOTE4NDU1MDcwNjE0FQIAERgSMjRCQUQ5RjQxRTJDQzQxQUEyAA==
	}

    @AuraEnabled
    public static void sendTextMessage(String messageContent, String toPhone){
        HttpRequest req= new HttpRequest();
        req.setEndpoint('https://graph.facebook.com/v15.0/'+System.Label.Phone_Number_Id+'/messages');
        req.setMethod('POST');
        req.setHeader('content-type', 'application/json');
        req.setHeader('Authorization','Bearer '+System.Label.WhatsappAccessToken);
        system.debug('messageContent:'+messageContent);
        String reqBody='{"messaging_product": "whatsapp","recipient_type": "individual","to": "'+toPhone+'","type": "text","text": {"body": "'+messageContent+'"}}';
        req.setBody(reqBody);
        system.debug('reqBody->'+reqBody);
        Http http= new Http();
        
        try{
            HttpResponse response= http.send(req);
            system.debug('response:'+response.getBody());
            if(response.getStatusCode()==200){
                WA_Message__c createRec= new WA_Message__c();
				WhatsappUtils wutil=(WhatsappUtils)JSON.deserialize(response.getBody(), WhatsappUtils.class);
                createRec.WA_Id__c=wutil.contacts.size()>0?wutil.contacts.get(0).wa_id:null;
				createRec.Type__c='text';
				createRec.Message_Id__c= wutil.messages.size()>0?wutil.messages.get(0).id:null;
                createRec.Message_Content__c=messageContent;
                createRec.Profile_Name__c='Whatsapp Bot';
                if(createRec.WA_Id__c!=null){
                createRec.Contact__c=WhatsappMessage.getContact(createRec.WA_Id__c, createRec.Profile_Name__c);
                Insert createRec;
                }
            }
        }Catch(System.CalloutException ex){
            system.debug('ex.getMessage()'+ex.getMessage());
            system.debug('ex.getStackTraceString()'+ex.getStackTraceString());
        }
    }
    
    @AuraEnabled
    public static void sendImageMessage(String imgUrl, String toPhone){
        system.debug('IN WhatsappUtils.sendImageMessage()');
        HttpRequest req= new HttpRequest();
        req.setEndpoint('https://graph.facebook.com/v15.0/'+System.Label.Phone_Number_Id+'/messages');
        req.setMethod('POST');
        req.setHeader('content-type', 'application/json');
        req.setHeader('Authorization','Bearer '+System.Label.WhatsappAccessToken);
        String reqBody='{"messaging_product": "whatsapp","recipient_type": "individual","to": "'+toPhone+'","type": "image","image": {"link": "'+imgUrl+'"}}';
        req.setBody(reqBody);
        
        Http http= new Http();
        
        try{
            HttpResponse response= http.send(req);
            system.debug('response:'+response.getBody());
            if(response.getStatusCode()==200){
                WA_Message__c createRec= new WA_Message__c();
				WhatsappUtils wutil=(WhatsappUtils)JSON.deserialize(response.getBody(), WhatsappUtils.class);
                createRec.WA_Id__c=wutil.contacts.size()>0?wutil.contacts.get(0).wa_id:null;
				createRec.Type__c='image';
				createRec.Message_Id__c= wutil.messages.size()>0?wutil.messages.get(0).id:null;
                createRec.Image_URL_new__c=imgUrl;
                createRec.Profile_Name__c='Whatsapp Bot';
                if(createRec.WA_Id__c!=null){
                createRec.Contact__c=WhatsappMessage.getContact(createRec.WA_Id__c, createRec.Profile_Name__c);
                }
                Insert createRec;
            }
        }Catch(System.CalloutException ex){
            system.debug('ex.getMessage()'+ex.getMessage());
            system.debug('ex.getStackTraceString()'+ex.getStackTraceString());
        }
    }
}