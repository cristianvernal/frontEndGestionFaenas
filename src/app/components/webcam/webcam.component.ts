import { Component, input, output } from '@angular/core';
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
  
  imageCapture(webcamImage: WebcamImage){
    console.log(webcamImage)
    this.capture.emit(webcamImage.imageAsDataUrl)
  }
  
}
