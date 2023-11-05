import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingComponent } from './components/meeting/meeting.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [{
  path:'meeting',
  component:MeetingComponent
},{
  path:'room/:roomId',
  component: RoomComponent
},{
  path:'',
  redirectTo:"meeting",
  pathMatch:'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
