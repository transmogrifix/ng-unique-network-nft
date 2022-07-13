import {NgModule} from "@angular/core";
import {HomeComponent} from "./home.component";
import {RouterModule} from "@angular/router";
import {ButtonComponent} from "../../core/components/button/button.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    ButtonComponent
  ],
})
export class HomeModule {}
