public class WhatsappMessageTriggerHandler {

    private static final string IMAGE_TYPE='image';
    private static final string QUESTION_TYPE='question';
    private static final string DIARY_TYPE='diary';
    public static List<WA_Message__c> imageList;
    public static void determineMessage(List<WA_Message__c> newMessages){
        imageList=new List<WA_Message__c>();
        List<Id> imgIdList= new List<id>();
        List<Id> textIdList= new List<id>();
        List<Id> diaryIdList = new List<id>();
        List<Id> imgMediaList = new List<Id>();

        Id diaryId = validateDiarySession();

        for(WA_Message__c wm: newMessages){

            if(wm.Type__c=='Image'){
                imgMediaList.add(wm.Id);
            }

            if(diaryId != null && wm.Message_Content__c!=null && wm.Profile_Name__c!='Whatsapp Bot'){
                diaryIdList.add(wm.Id);
            }

            if(wm.Message_Content__c!=null && wm.Message_Content__c.equalsIgnoreCase(DIARY_TYPE) && wm.Profile_Name__c!='Whatsapp Bot'){
                diaryIdList.add(wm.id);
                WhatsappMessageTriggerHandler.startDiarySession(diaryIdList);
                return;
                
            }
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
        if(diaryIdList.size()>0){
            WhatsappMessageTriggerHandler.setDiaryEntries(diaryIdList,diaryId);
        }

        if(imageList.size()>0){
            WhatsappMessageTriggerHandler.sendImageURls(imgIdList);
        }
        
        if(textIdList.size()>0){
            WhatsappMessageTriggerHandler.sendAnswers(textIdList);
        }

        if(imgMediaList.size()>0){
            WhatsappMessageTriggerHandler.processImageRecs(imgMediaList,diaryId);
        }
        
    }


    public static Id validateDiarySession(){
        List<Diary__c> latestDiary = [SELECT Id,Name,Session_Start__c,Session_End__c,Completed__c,Entry__c FROM Diary__c ORDER BY CreatedDate DESC LIMIT 1];
        if(!latestDiary.isEmpty() && latestDiary[0].Session_End__c>System.now() && !latestDiary[0].Completed__c){
            return latestDiary[0].Id;
        }
        return null;
    }

    @future(callout=true)
    public static void startDiarySession(List<Id> diaryIdList){
        List<WA_Message__c> textListNew=[SELECT Id,WA_Id__c,Message_Content__c FROM WA_Message__c WHERE Id in: diaryIdList];
        String whatsappId = textListNew[0].WA_Id__c;
        Diary__c diary= new Diary__c();
        diary.Session_Start__c=System.now();
        diary.Session_End__c=System.now().addHours(3);
        diary.Contact__c=Id.valueOf(System.Label.Diary_Contact);
        

        WhatsappUtils.sendTextMessage('Diary is created. Session ends at '+diary.Session_End__c.format('HH:mm','Asia/Kolkata'),whatsappId);
        Insert diary;
    }

    @future(callout=true)
    public static void setDiaryEntries(List<Id> entryIdList,Id diaryId){
        Diary__c latestDiary = [SELECT Id,Name,Session_Start__c,Session_End__c,Completed__c,Entry__c FROM Diary__c WHERE Id=: diaryId LIMIT 1];
        List<WA_Message__c> entryListNew=[SELECT Id,WA_Id__c,Message_Content__c FROM WA_Message__c WHERE Id in: entryIdList];
        String whatsappId = entryListNew[0].WA_Id__c;
        Boolean endDiarySession = false;
        for(WA_Message__c wm: entryListNew){
            if(wm.Message_Content__c.equalsIgnoreCase('diaryend')){
                endDiarySession=true;
                break;
            }else{
                
                latestDiary.Entry__c=latestDiary.Entry__c==null?wm.Message_Content__c:latestDiary.Entry__c+wm.Message_Content__c;
                latestDiary.Entry__c+='<br/>';
            }
        }

        if(endDiarySession){
            latestDiary.Completed__c=true;
            WhatsappUtils.sendTextMessage('Diary session completed at '+Datetime.now().format('HH:mm','Asia/Kolkata'),whatsappId);
        }

        update latestDiary;
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
    public static void processImageRecs(List<Id> imgIdList, Id diaryId){
        system.debug('In processImageRecs');
        system.debug('imgIdList->'+imgIdList);
        List<WA_Message__c> imageListNew=[SELECT Id,WA_Id__c,Message_Content__c,Media_Id__c FROM WA_Message__c WHERE Id in: imgIdList LIMIT 1];
        if(!imageListNew.isEmpty()){
            WA_Message__c imgRec = imageListNew[0];
            //Callout to get image url
            Http http= new Http();
            HttpRequest req= new HttpRequest();
            req.setMethod('GET');
            req.setEndpoint('https://graph.facebook.com/v13.0/'+imgRec.Media_Id__c);
            req.setHeader('content-type', 'application/json');
            req.setHeader('Authorization','Bearer '+System.Label.WhatsappAccessToken);
            HttpResponse res= http.send(req);
            if(res.getStatusCode()!=200){
                system.debug('RESPONSE: '+res.getStatusCode()+' -- '+res.getBody());
                return;
            }
            WAImgResponseURL imgRes=(WAImgResponseURL)JSON.deserialize(res.getBody(),WAImgResponseURL.class);
            
            //Formatting the received URL
            String recUrl=formattedUrl(imgRes.url);
            system.debug('Formatted URL: '+recUrl);

            //callout to get binary file
            HttpRequest req2= new HttpRequest();
            req2.setMethod('GET');
            req2.setEndpoint(recUrl);
            req2.setHeader('Authorization','Bearer '+System.Label.WhatsappAccessToken);
            HttpResponse res2= http.send(req2);
            system.debug('RESPONSE: '+res2.getStatusCode()+' -- '+res2.getBody());
            if(res2.getStatusCode()!=200){
                
                return;
            }
            //pass binary file to GoogleDriveAPI
            GoogleDriveAPI.createFileWhatsapp(imgRec.Id,diaryId, 'WA Image '+DateTime.now().format('MM/dd/yyyy HH:mm:ss'), imgRes.mime_type,res2.getBodyAsBlob());
        }
    }

    public static String formattedUrl(String url){
        String retUrl=url.unescapeJava();
        return retUrl;
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


    public class WAImgResponseURL{
        public string url;
        public string mime_type;
    }
}