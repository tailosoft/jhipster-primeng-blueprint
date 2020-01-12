import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.PrimengtestEmployeeModule)
      },
      {
        path: 'employee-skill',
        loadChildren: () => import('./employee-skill/employee-skill.module').then(m => m.PrimengtestEmployeeSkillModule)
      },
      {
        path: 'certificate-type',
        loadChildren: () => import('./certificate-type/certificate-type.module').then(m => m.PrimengtestCertificateTypeModule)
      },
      {
        path: 'employee-skill-certificate',
        loadChildren: () =>
          import('./employee-skill-certificate/employee-skill-certificate.module').then(m => m.PrimengtestEmployeeSkillCertificateModule)
      },
      {
        path: 'task',
        loadChildren: () => import('./task/task.module').then(m => m.PrimengtestTaskModule)
      },
      {
        path: 'task-comment',
        loadChildren: () => import('./task-comment/task-comment.module').then(m => m.PrimengtestTaskCommentModule)
      },
      {
        path: 'price-formula',
        loadChildren: () => import('./price-formula/price-formula.module').then(m => m.PrimengtestPriceFormulaModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class PrimengtestEntityModule {}
