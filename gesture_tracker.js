import { Utils } from './utils.js';
import { SilenceGesture } from './gestures/silence.js';
import { ThinkingGesture } from './gestures/thinking.js';
import { ThumbsUpGesture } from './gestures/thumbs_up.js';
import { MindBlownGesture } from './gestures/mind_blown.js';
import { HeadShakeGesture } from './gestures/head_shake.js';

const GESTURE_NAMES = Object.freeze({
  THINKING: 'Thinking',
  SILENCE: 'Silence',
  THUMBS_UP: 'Thumbs Up',
  MIND_BLOWN: 'Mind Blown',
  HEAD_SHAKE: 'Head Shake'
});

// TODO: refactor out rest of gestures into their own class
class GestureTracker {
  constructor() {
    this.faceData = null;
    this.activeGestures = [];
    this.utils = new Utils();
    this.silenceGesture = new SilenceGesture();
    this.thinkingGesture = new ThinkingGesture();
    this.thumbsUpGesture = new ThumbsUpGesture();
    this.mindBlownGesture = new MindBlownGesture();
    this.headShakeGesture = new HeadShakeGesture();
  }

  updateFaceData(faceLandmarks) {
    if (faceLandmarks && faceLandmarks.length > 0) {
      this.faceData = faceLandmarks[0];
    }
  }

  trackHeadShakeGesture(currentTime) {
    if (!this.faceData) {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.HEAD_SHAKE);
      return;
    }

    if (this.headShakeGesture.trackHeadShake(this.faceData, currentTime)) {
      if (!this.activeGestures.includes(GESTURE_NAMES.HEAD_SHAKE)) {
        this.activeGestures.push(GESTURE_NAMES.HEAD_SHAKE);
      }
      return;
    } else {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.HEAD_SHAKE);
    }
  }

  trackMindBlownGesture(handLandmarks, currentTime) {
    if (!handLandmarks || handLandmarks.length === 0) {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.MIND_BLOWN);
      return false;
    }

    if (this.mindBlownGesture.trackMindBlownGesture(handLandmarks, this.faceData, currentTime)) {
        if (!this.activeGestures.includes(GESTURE_NAMES.MIND_BLOWN)) {
          this.activeGestures.push(GESTURE_NAMES.MIND_BLOWN);
        }
        return true;
    } else {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.MIND_BLOWN);
    }

    return false;
  }



  trackThinkingGesture(handLandmarks, currentTime) {
  
    if (!handLandmarks || handLandmarks.length === 0) {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.THINKING);
      return;
    }

    if (this.thinkingGesture.trackThinkingGesture(handLandmarks, this.faceData, currentTime)) {
        if (!this.activeGestures.includes(GESTURE_NAMES.THINKING)) {
          this.activeGestures.push(GESTURE_NAMES.THINKING);
        }
        return;
    } else {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.THINKING);
    }

    return;

  }

  trackThumbsUpGesture(gestureResults) {
    if (!gestureResults?.gestures?.length) {
      this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.THUMBS_UP);
      return;
    }
    
    if (this.thumbsUpGesture.trackThumbsUpGesture(gestureResults)) {
      if (!this.activeGestures.includes(GESTURE_NAMES.THUMBS_UP)) {
        this.activeGestures.push(GESTURE_NAMES.THUMBS_UP)
      }
      return;
    } else {
    this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.THUMBS_UP);
    return;
    }
  }

  trackSilenceGesture (handlandmarks, currentTime) {
    if(this.silenceGesture.trackSilenceGesture(handlandmarks, this.faceData, currentTime)) {
      //console.log('silence');
      if (!this.activeGestures.includes(GESTURE_NAMES.SILENCE)) {
        this.activeGestures.push(GESTURE_NAMES.SILENCE);
        return;
      }

    } else {
      //console.log('Not silence');
      if (this.activeGestures.includes(GESTURE_NAMES.SILENCE)) {
        this.activeGestures = this.activeGestures.filter(g => g !== GESTURE_NAMES.SILENCE);
        return;
      }
    }
  }
  
  drawGestureText(ctx) {
    if (this.activeGestures.length === 0) return;
    console.log('Active');
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '32px Arial';
    
    this.activeGestures.forEach((gesture, index) => {
      const text = `Detected: ${gesture}`;
      ctx.strokeText(text, 10, 30 + (index * 30));
      ctx.fillText(text, 10, 30 + (index * 30));
    });
    
    ctx.restore();
  }
}

export {GestureTracker};