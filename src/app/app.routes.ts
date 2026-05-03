import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Projects } from './projects/projects';
import { Skills } from './skills/skills';
import { Hero } from './hero/hero';
import { AdminLogin } from './admin/admin-login';
import { AdminDashboard } from './admin/admin-dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Hero, },
  { path: 'hero', component: Hero },
  { path: 'home', component: Home },
  { path: 'contact', component: Contact },
  { path: 'projects', component: Projects },
  { path: 'skills', component: Skills },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [authGuard] }
];
