import { LightningElement } from 'lwc';
import AUDIO_CRICKETS from '@salesforce/resourceUrl/Crickets';
import AUDIO_WAVES from '@salesforce/resourceUrl/Waves';
import AUDIO_CAMPFIRE from '@salesforce/resourceUrl/Campfire';
import ICON_ATMOS from '@salesforce/resourceUrl/AtmosphereIcons';
import IMAGE_MOUNTAINS from '@salesforce/resourceUrl/Mountains';
export default class Atm_Home extends LightningElement {


    audioUrls=[{'key':1,'code':'Crickets','url':AUDIO_CRICKETS,'imgurl':ICON_ATMOS+'/Icons/crickets.png'},
    {'key':1,'code':'Waves','url':AUDIO_WAVES,'imgurl':ICON_ATMOS+'/Icons/waves.png'},
    {'key':1,'code':'Campfire','url':AUDIO_CAMPFIRE,'imgurl':ICON_ATMOS+'/Icons/campfire.png'}];
    isLoaded=false;

    mountainImgUrl = IMAGE_MOUNTAINS;
    connectedCallback(){
        console.log('audioUrls->'+this.audioUrls);
        this.isLoaded=true;
    }
    
    renderedCallback(){
        let titleCls=this.template.querySelector('.title-cls');
        let bgUrl='background: url('+this.mountainImgUrl+')';
        console.log('bgUrl: '+bgUrl);
        titleCls.style=bgUrl;
    }

    playAudio(fileName){
        // if(fileName=='Crickets'){
        //     playUrl=
        // }
    }


}