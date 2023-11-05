import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {

  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  stream: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const room = params['roomId'];
      this.init(room);
    });
  }

  async init(room:string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    await this.setVideoStream(stream);
    await this.socketService.sendMessage('join-room', room);
    await this.socketService.listenToRoom();

    this.socketService.stream$.subscribe(stream => {
      console.log("Remote Stream Received");
      this.remoteVideo.nativeElement.srcObject = stream;
    })
  }

  setVideoStream(stream: any): void {
    this.stream = stream;
    this.socketService.stream = stream
    this.localVideo.nativeElement.srcObject = stream;
  }

}
