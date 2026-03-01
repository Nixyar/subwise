import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      <!-- Sidebar (Desktop) -->
      <aside class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div class="p-6 flex items-center space-x-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <mat-icon class="text-white text-sm">auto_awesome</mat-icon>
          </div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">SubWise</span>
        </div>
        
        <nav class="flex-1 px-4 space-y-2 mt-4">
          <a routerLink="/" routerLinkActive="bg-indigo-50 text-indigo-700" [routerLinkActiveOptions]="{exact: true}" class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <mat-icon class="mr-3">dashboard</mat-icon>
            Дашборд
          </a>
          <a routerLink="/insights" routerLinkActive="bg-indigo-50 text-indigo-700" class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <mat-icon class="mr-3">lightbulb</mat-icon>
            Insights
          </a>
          <a routerLink="/summary" routerLinkActive="bg-indigo-50 text-indigo-700" class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <mat-icon class="mr-3">share</mat-icon>
            Мой итог
          </a>
        </nav>
        
        <div class="p-4">
          <a routerLink="/add" class="flex items-center justify-center w-full px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            <mat-icon class="mr-2">add</mat-icon>
            Добавить
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-64 pb-20 md:pb-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Nav (Mobile) -->
      <nav class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-20 px-2">
        <a routerLink="/" routerLinkActive="text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center justify-center w-full h-full text-gray-500">
          <mat-icon>dashboard</mat-icon>
          <span class="text-[10px] font-medium mt-1">Дашборд</span>
        </a>
        <a routerLink="/insights" routerLinkActive="text-indigo-600" class="flex flex-col items-center justify-center w-full h-full text-gray-500">
          <mat-icon>lightbulb</mat-icon>
          <span class="text-[10px] font-medium mt-1">Insights</span>
        </a>
        <div class="relative -top-5">
          <a routerLink="/add" class="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30">
            <mat-icon>add</mat-icon>
          </a>
        </div>
        <a routerLink="/summary" routerLinkActive="text-indigo-600" class="flex flex-col items-center justify-center w-full h-full text-gray-500">
          <mat-icon>share</mat-icon>
          <span class="text-[10px] font-medium mt-1">Итог</span>
        </a>
      </nav>
      
    </div>
  `
})
export class App {}
