public class GoogleDriveAPI {
	
    public static void getFiles(){
        Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('callout:GoogleDriveAPI/drive/v3/files');
        req.setHeader('Content-type', 'application/json');
        req.setMethod('GET');
        
        HttpResponse res=http.send(req);
        
            system.debug('STATUS='+res.getStatusCode());
            system.debug(res.getBody());
        
    }
    
    @future(callout=true)
    public static void getFilesFuture(){
        GoogleDriveAPI.getFiles();
    }
    
    public static void getFileById(String Id){
        Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('callout:GoogleDriveAPI/drive/v3/files/'+Id);
        req.setHeader('Content-type', 'application/json');
        req.setMethod('GET');
        
        HttpResponse res=http.send(req);
        
            system.debug('STATUS='+res.getStatusCode());
            system.debug(res.getBody());
    }

    @AuraEnabled(cacheable=true)
    public static String getImageData(String recordId){
        try {
            //Getting drive file Id
            List<Drive_File__c> driveFile = [SELECT Id,File_Id__c FROM Drive_File__c WHERE Id=: recordId];
            if(driveFile==NULL || driveFile.isEmpty()){
                return NULL;
            }

            Http http = new Http();
            HttpRequest req= new HttpRequest();
            req.setEndpoint('https://www.googleapis.com/drive/v3/files/'+driveFile[0].File_Id__c+'?alt=media');
            req.setHeader('Authorization','Bearer '+GoogleAPISettings__c.getInstance().Access_Token__c);
            req.setMethod('GET');
            HttpResponse res=http.send(req);
            system.debug('STATUS='+res.getStatusCode());
            system.debug(res.getBody());

           
            // HttpRequest req2= new HttpRequest();
            // req2.setEndpoint('callout:GoogleDriveAPI/drive/v3/files/'+driveFile[0].File_Id__c+'/export?mimeType='+respWrap.mimeType);
            // req2.setMethod('GET');
            // HttpResponse res2=http.send(req2);
        
            // system.debug('STATUS='+res2.getStatusCode());
            // system.debug(res2.getBody());
            return 'data:image/jpeg'+';charset=utf-8;base64, '+EncodingUtil.base64Encode(res.getBodyAsBlob());
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createFile(String documentId, String documentName, String mimeType,String contactId){
       ContentVersion cv= [SELECT Id,VersionData from ContentVersion WHERE ContentDocumentId=: documentId];
       Blob filedata=cv.VersionData; 
       //String encStr=EncodingUtil.base64Encode(filedata);
       system.debug('mimeType: '+mimeType);
       system.debug('filedata: '+filedata);
       Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('https://www.googleapis.com/upload/drive/v3/files?uploadType=media');
        req.setHeader('Authorization','Bearer '+GoogleAPISettings__c.getInstance().Access_Token__c);
        req.setHeader('Content-type', mimeType);
        req.setHeader('includePermissionsForView','published');
        req.setMethod('POST');
        req.setBodyAsBlob(filedata);
        HttpResponse res=http.send(req);
        if(res.getStatusCode()==200){
            ResponseWrapper rw=(ResponseWrapper)JSON.deserialize(res.getBody(), ResponseWrapper.class);
            ContentDocument cd=[SELECT Id FROM ContentDocument WHERE Id=: documentId LIMIT 1];
            Delete cd;
            Drive_File__c df= new Drive_File__c();
            df.Contact__c=contactId;
            df.File_Id__c=rw.id;
            df.File_Name__c=documentName;
            df.File_URL__c='https://drive.google.com/open?id='+df.File_Id__c;
            insert df;
        }
            system.debug('STATUS='+res.getStatusCode());
            system.debug(res.getBody());
    }

    @AuraEnabled
    public static void createFileWhatsapp(String wmessageId, Id diaryId, String documentName, String mimeType,Blob filedata){
    //    ContentVersion cv= [SELECT Id,VersionData from ContentVersion WHERE ContentDocumentId=: documentId];
    //    Blob filedata=cv.VersionData; 
       //String encStr=EncodingUtil.base64Encode(filedata);
       system.debug('mimeType: '+mimeType);
       system.debug('filedata: '+filedata);
       Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('https://www.googleapis.com/upload/drive/v3/files?uploadType=media');
        req.setHeader('Authorization','Bearer '+GoogleAPISettings__c.getInstance().Access_Token__c);
        req.setHeader('Content-type', mimeType);
        req.setHeader('includePermissionsForView','published');
        req.setMethod('POST');
        req.setBodyAsBlob(filedata);
        HttpResponse res=http.send(req);
        if(res.getStatusCode()==200){
            ResponseWrapper rw=(ResponseWrapper)JSON.deserialize(res.getBody(), ResponseWrapper.class);
            // ContentDocument cd=[SELECT Id FROM ContentDocument WHERE Id=: documentId LIMIT 1];
            // Delete cd;
            Drive_File__c df= new Drive_File__c();
            df.WA_Message__c=wmessageId;
            df.File_Id__c=rw.id;
            df.File_Name__c=documentName;
            df.File_URL__c='https://drive.google.com/open?id='+df.File_Id__c;
            if(diaryId!=NULL){
                df.Diary__c	=diaryId;
            }
            insert df;
        }
            system.debug('STATUS='+res.getStatusCode());
            system.debug(res.getBody());
    }


    public static void getTokens(String authCode){
        Http http = new Http();
        HttpRequest req= new HttpRequest();
        String endpoint='https://oauth2.googleapis.com/token';
        req.setHeader('content-Type','application/x-www-form-urlencoded');

        AuthCodeRequest auth = new AuthCodeRequest();
        auth.client_id=GoogleAPISettings__c.getInstance().Client_Id_c__c;
        auth.client_secret=GoogleAPISettings__c.getInstance().Client_Secret__c;
        auth.code=authCode;
        auth.grant_type='authorization_code';
        auth.redirect_uri='https://bhagabat-lwc-dev-dev-ed.develop.my.site.com/portfolio';
        req.setMethod('POST');
        req.setEndpoint(endpoint);
        String reqBody=JSON.serialize(auth);
        system.debug('reqBody->'+reqBody);
        req.setBody(JSON.serialize(reqBody));

        HttpResponse resp= http.send(req);
        system.debug('resp->'+resp.getStatusCode()+' -- '+resp.getBody());
    }

    @future(callout=true)
    public static void updateAccessTokenFuture(){
        GoogleDriveAPI.updateAccessToken();
    }

    public static void updateAccessToken(){
        String endpoint='https://oauth2.googleapis.com/token';
        String clientId=GoogleAPISettings__c.getInstance().Client_Id_c__c;
        String clientSecret=GoogleAPISettings__c.getInstance().Client_Secret__c;
        String refreshToken=GoogleAPISettings__c.getInstance().Refresh_Token__c;
        
        // RefreshTokenRequest refReq= new RefreshTokenRequest();
        // refReq.client_id=clientId;
        // refReq.client_secret=clientSecret;
        // refReq.grant_type='refresh_token';
        // refReq.refresh_token=refreshToken;

        String reqBody='client_id='+EncodingUtil.urlEncode(clientId,'UTF-8');
        reqBody+='&client_secret='+EncodingUtil.urlEncode(clientSecret,'UTF-8');
        reqBody+='&refresh_token='+refreshToken;
        reqBody+='&grant_type=refresh_token';
        
        Http http = new Http();
        HttpRequest req= new HttpRequest();
        
        req.setEndpoint(endpoint);
        req.setHeader('Content-length',string.valueOf(reqBody.length()));
        req.setHeader('Content-type','application/x-www-form-urlencoded');
        req.setMethod('POST');
        req.setBody(reqBody);

        system.debug('REQ BODY: '+req.getBody());
        HttpResponse res = http.send(req);

        system.debug(res.getBody());
        if(res.getStatusCode()==200){
            ResponseAccessToken token= (ResponseAccessToken)JSON.deserialize(res.getBody(),ResponseAccessToken.class);
            GoogleAPISettings__c temp= [SELECT Id,Access_Token__c FROM GoogleAPISettings__c LIMIT 1];
            temp.Access_Token__c=token.access_token;

            update temp;
        }

        

    }

    public Class AuthCodeRequest{
        public string client_id;
        public string client_secret;
        public string code;
        public string grant_type;
        public string redirect_uri;
    }

    public class RefreshTokenRequest{
        public string client_id;
        public string client_secret;
        public string grant_type;
        public string refresh_token;
    }

    public class ResponseAccessToken{
        public string access_token;
    }
    
    public class ResponseWrapper{
        public string kind{get;set;}
        public string id{get;set;}
        public string name{get;set;}
        public string mimeType{get;set;}
    }
}