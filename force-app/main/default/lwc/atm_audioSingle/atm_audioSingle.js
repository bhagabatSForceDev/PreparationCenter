import { api,LightningElement } from 'lwc';

export default class Atm_audioSingle extends LightningElement {

    @api audioUrl;
    @api audioCode;
    @api imgUrl;

    isPlaying=false;

    handlePlay(e){
        let audioFile=this.template.querySelector('.audio-cls');
        let audioCls=this.template.querySelector('.audio-player');
        let sliderCls=this.template.querySelector('.volume-slider');
        console.log('audioFile->'+JSON.stringify(audioFile));
        if(!this.isPlaying){
            audioFile.play();
            audioCls.classList.add('is-playing');
            this.isPlaying=true;
        }else{
            audioFile.pause();
            audioCls.classList.remove('is-playing');
            this.isPlaying=false;
        }
    }

    handleVolumeChange(e){
        console.log('VOLUME CHANGE: '+e.currentTarget.value);
        let audioFile=this.template.querySelector('.audio-cls');
        audioFile.volume = (e.currentTarget.value/100);
    }
}