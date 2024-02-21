public class GoogleCalendarAPI {

    
    public static void getCalendarList(){
        // /users/me/calendarList
        Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('callout:GoogleCalendarAPI/users/me/calendarList');
        req.setHeader('Content-type', 'application/json');
        req.setMethod('GET');
        
        HttpResponse res=http.send(req);
        
            system.debug('STATUS='+res.getStatusCode());
            system.debug(res.getBody());
    }
    
    
    public static List<Item> getEvents(String calendarId,String timeMin, String timeMax){
        Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('https://www.googleapis.com/calendar/v3/calendars/'+calendarId+'/events?timeMax='+timeMax+'&timeMin='+timeMin);
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization','Bearer '+GoogleAPISettings__c.getInstance().Access_Token__c);
        req.setMethod('GET');
        
        HttpResponse res=http.send(req);
        
            system.debug('STATUS='+res.getStatusCode());
            //system.debug(res.getBody());
            String body=res.getBody();
        body=body.replaceAll('start":','xstart":');
        body=body.replaceAll('end":','xend":');
        body=body.replaceAll('dateTime":','xdateTime":');
        Events e=(Events)JSON.deserialize(body,Events.class);
        for(Item i: e.items){
            system.debug(i.summary+' -- '+i.xstart.xdateTime);
        }
        /*system.debug('EVENT: '+e);*/
        return e.items;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Item> getEventsToday(){
        String calendarId=System.Label.calendarId;
        Datetime todayDt=DateTime.now();
        Datetime tommDt=DateTime.now().addDays(1);
        String timeMax=tommDt.year()+'-'+tommDt.month()+'-'+tommDt.day()+'T00:00:00Z';
        String timeMin=todayDt.year()+'-'+todayDt.month()+'-'+todayDt.day()+'T00:00:00Z';
        List<Item> allItems=getEvents(calendarId,timeMin,timeMax);
        Item lastItem;
        for(Item i: allItems){
            lastItem=i;
            system.debug('ITEM: '+i);
        }
        system.debug('Last Item: '+lastItem);
        system.debug(allItems);
        return allItems;
    }
    
    @AuraEnabled
    public static String addEvent(String summary, DateTime startTime, DateTime endTime){
        system.debug('summary-> '+summary);
        system.debug('startTime-> '+startTime);
        system.debug('endTime-> '+endTime);
        
        String startTimeReq=startTime.format('yyyy-MM-dd','Asia/Kolkata')+'T'+startTime.format('HH:mm:ss.SSSZ','Asia/Kolkata');
        String endTimeReq=endTime.format('yyyy-MM-dd','Asia/Kolkata')+'T'+endTime.format('HH:mm:ss.SSSZ','Asia/Kolkata');
        
        Http http= new Http();
        HttpRequest req= new HttpRequest();
        req.setEndpoint('https://www.googleapis.com/calendar/v3/calendars/'+System.Label.calendarId+'/events');
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization','Bearer '+GoogleAPISettings__c.getInstance().Access_Token__c);
        req.setMethod('POST');
        req.setBody('{"summary":"'+summary+'","start":{"dateTime":"'+startTimeReq+'","timeZone":"Asia/Kolkata"},"end":{"dateTime":"'+endTimeReq+'","timeZone":"Asia/Kolkata"}}');
        
        HttpResponse res=http.send(req);
        system.debug(res.getStatusCode()+' -- '+res.getBody());
        return String.valueOf(res.getStatusCode());
    }
    
    
    public class Events{
        public string kind;
        public string summary;
        public List<Item> items;
    }
    
    
    public class Item{
        @AuraEnabled public string kind;
        @AuraEnabled public string id;
        @AuraEnabled public string summary;
        @AuraEnabled public GDate xstart;
        @AuraEnabled public GDate xend;
    }
    
    public class GDate{
        @AuraEnabled public Datetime xdateTime{
           set{
               	xdateTime= value;
                this.dateString= value.format('yyyy-MM-dd','Asia/Kolkata')+'T'+value.format('HH:mm:ss.SSSZ','Asia/Kolkata');
                system.debug('@BHAG dateString:'+dateString);
            }
            get{
                return this.xdateTime;
            }
        }
        @AuraEnabled public string timeZone;
        @AuraEnabled public String dateString;
    }
}