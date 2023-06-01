public class WhatsappMessageTriggerHandler {

    private static final string IMAGE_TYPE='image';
    private static final string QUESTION_TYPE='question';
    public static List<WA_Message__c> imageList;
    public static void determineMessage(List<WA_Message__c> newMessages){
        imageList=new List<WA_Message__c>();
        List<Id> imgIdList= new List<id>();
        List<Id> textIdList= new List<id>();
        for(WA_Message__c wm: newMessages){
            system.debug('wm.Message_Content__c->'+wm.Message_Content__c);
            if(wm.Message_Content__c!=null && wm.Message_Content__c.startsWith(IMAGE_TYPE) && wm.Profile_Name__c!='Whatsapp Bot'){
                imageList.add(wm);
                imgIdList.add(wm.id);
            }
            if(wm.Message_Content__c!=null && wm.Message_Content__c.startsWith(QUESTION_TYPE) && wm.Profile_Name__c!='Whatsapp Bot'){
                textIdList.add(wm.id);
            }
        }
        system.debug('imageList->'+imageList);
        system.debug('textIdList->'+textIdList);
        if(imageList.size()>0){
            WhatsappMessageTriggerHandler.sendImageURls(imgIdList);
        }
        
        if(textIdList.size()>0){
            WhatsappMessageTriggerHandler.sendAnswers(textIdList);
        }
        
    }
    
    @future(callout=true)
    public static void sendAnswers(List<Id> textIdList){
        system.debug('In Send Answers URIs');
        system.debug('textIdList->'+textIdList);
        List<WA_Message__c> textListNew=[SELECT Id,WA_Id__c,Message_Content__c FROM WA_Message__c WHERE Id in: textIdList];
        
        for(WA_Message__c wm:textListNew){
            List<String> strList=wm.Message_Content__c.split('question');
            system.debug('strList->'+strList);
            String str;
            if(strList.size()>=2){
                str=strList[1];
            System.debug('str->'+str);
             String responseStr=ChatGPTIntegration.getAnswer(str);
             responseStr=responseStr.replaceAll('\n', ' ');
             responseStr=responseStr.replaceAll('\t', '');
             system.debug('responseStr->'+responseStr);
             WhatsappUtils.sendTextMessage(responseStr, wm.WA_Id__c);
             
            }    
        }
    }
    
    
    
    @future(callout=true)
    public static void sendImageURls(List<Id> imgIdList){
        system.debug('In Send Image URIs');
        system.debug('imgIdList->'+imgIdList);
        List<WA_Message__c> imageListNew=[SELECT Id,WA_Id__c,Message_Content__c FROM WA_Message__c WHERE Id in: imgIdList];
        Map<String,List<String>> waidToURLMap= new Map<String,List<String>>();
        for(WA_Message__c wm: imageListNew){
            waidToURLMap.put(wm.WA_Id__c,new List<String>());
            List<String> strList=wm.Message_Content__c.split('image');
            system.debug('strList->'+strList);
            String str;
            if(strList.size()>=2){
                str=strList[1];
            System.debug('str->'+str);
            waidToURLMap.get(wm.WA_Id__c).addAll(ChatGPTIntegration.generateImage(str, '1024x1024', 1));
            }    
        }
        
        for(String waid: waidToURLMap.keySet()){
            for(String url: waidToURLMap.get(waid)){
                System.debug('For SEND MESSAGE: waid:'+waid+' url:'+url);
            	WhatsappUtils.sendImageMessage(url, waid);
            }
        }
    }
}