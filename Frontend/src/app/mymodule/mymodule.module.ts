import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { MyModuleRoutingModule } from './mymodule.routing'

import { UserService } from '../services/user.service';
import { UserComponent } from './user/user.component'


@NgModule({
    declarations: [
        UserComponent

    ],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        FormsModule, 
        HttpModule,
        MyModuleRoutingModule
    ],
    providers: [
        UserService,
    ]
})
export class MyModuleModule { }