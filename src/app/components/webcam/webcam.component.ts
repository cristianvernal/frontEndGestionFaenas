import { Component, effect, input, output } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [WebcamModule],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.css'
})
export class WebcamComponent {
  trigger = input.required<Observable<void>>()
  capture = output<string>()
  scanWorker = false;
  imageUrl = '';
 
  imageCapture(webcamImage: WebcamImage){
    console.log(webcamImage)
    this.capture.emit(webcamImage.imageAsBase64)
    this.imageUrl = webcamImage.imageAsDataUrl
  }

  onCleanImage() {
    this.imageUrl = ''
  }

}
