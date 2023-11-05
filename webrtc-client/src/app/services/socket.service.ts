import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
declare var SimplePeer:any;
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  stream!:MediaStream;
  stream$:Subject<MediaStream> = new Subject();
  constructor(private socket:Socket) {
   }

  sendMessage(key:string,message:any){
    this.socket.emit(key,message);
  }

  listenToRoom(): void {
    this.socket.on('user-joined', () => {
      console.log('User Joined Event Received!');
      this.startCall(this.stream);
    });

    this.socket.on('offer', (offer: any) => {
      console.log('Offer Received!');
      this.answerCall(offer,this.stream);
    });
  }

  startCall(stream:any){

    const peer = new SimplePeer({initiator:true,stream});

    peer.on("signal",(data:any)=>{
      console.log("Signal Data received" + JSON.stringify(data));
      this.sendMessage("offer",{offer:data,roomName:'test'})
    });

    peer.on("stream",(stream:any)=>{
      console.log("Stream Data received"+stream);
      this.stream$.next(stream);
    })

    this.socket.on("answer",(answer:any)=>{
      console.log("Answer Data received" + JSON.stringify(answer));
      peer.signal(answer);
    })

  }

  answerCall(offer:any,stream:any){
    console.log("Answer CALL");
    const peer = new SimplePeer({initiator:false,stream});

    peer.on("signal",(data:any)=>{
      console.log("Answering Call" + JSON.stringify(data));
      this.sendMessage("answer",{answer:data,roomName:'test'})
    });

    peer.on("stream",(stream:any)=>{
      console.log("Stream Data received"+stream);
      this.stream$.next(stream);
    })

    peer.signal(offer);

  }
}
