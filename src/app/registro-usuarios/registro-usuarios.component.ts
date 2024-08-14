import { Component, OnInit, } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { cpfValidator } from '../validatorCpf/validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-usuarios',
  standalone: true,
  imports: [
    MatSlideToggleModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    NgIf, 
   ],

  templateUrl: './registro-usuarios.component.html',
  styleUrl: './registro-usuarios.component.css'
})

export class SigninPageComponent implements OnInit{
  registrationForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private http: HttpClient,  private router: Router) {  }
  
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['',[  Validators.required, cpfValidator()]], //chama a função cpfValidator para validar o cpf registrado
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      cep: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  //validar se as senhas coincidem
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

// consultar CEP e atualiza o endereço automaticamente|| API VIACEP
consultarCep(): void {
  const cep = this.registrationForm.get('cep')?.value;
  if (cep && cep.length === 8) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
      if (data.erro) {
        this.registrationForm.get('cep')?.setErrors({ invalidCep: true });
      } else {
        this.registrationForm.patchValue({
          endereco: data.logradouro
        });
      }
    }, () => {
      this.registrationForm.get('cep')?.setErrors({ invalidCep: true });
    });
  }
}

//validando o cep
cepValidator(control: any) {
  const cep = control.value;
  if (cep && cep.length === 8) {
    return null;
  }
  return { invalidCep: true };
}

  onSubmit(): void {
    if (this.registrationForm.valid){
      console.log(this.registrationForm.value);

      this.router.navigate(['/login']);
    }else{ 
      console.log('Formulário é inválido');
    }
  }
}

