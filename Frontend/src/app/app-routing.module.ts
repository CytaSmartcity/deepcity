import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';

import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'user', pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: 'app/mymodule/mymodule.module#MyModuleModule'
    }
]

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }
