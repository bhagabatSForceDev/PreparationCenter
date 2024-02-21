public class ScheduledGoogleCall implements Schedulable,Database.allowsCallouts{

    public void execute(SchedulableContext sc){
        GoogleDriveAPI.updateAccessTokenFuture();
    }
}