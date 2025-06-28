import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  operation : string = '';
  result : string = '';

  constructor() {}

  append(value: string) {
    const last = this.operation.slice(-1);
    const ops = ['+', '-', '*', '/', '.'];

    // No doble operador
    if (ops.includes(last) && ops.includes(value)) return;

    // No iniciar con operador incorrecto
    if (!this.operation && ['+', '*', '/', '.'].includes(value)) return;

    // Punto: no repetir en el mismo número
    if (value === '.') {
      const lastNum = this.operation.split(/[\+\-\*\/\(\)]/).pop();
      if (lastNum?.includes('.')) return;
    }

    // Paréntesis: balanceo
    if (value === '(') {
      if (/\d$/.test(last)) this.operation += '*';
      this.operation += '(';
      return;
    }

    if (value === ')') {
      const open = (this.operation.match(/\(/g) || []).length;
      const close = (this.operation.match(/\)/g) || []).length;
      if (open <= close || last === '(') return;
    }

    this.operation += value;
  }

  clear() {
    this.operation = '';
    this.result = '';
  }

  toggleSign() {
    try {
      const val = eval(this.replaceFunctions(this.operation));
      this.operation = (-val).toString();
    } catch {
      this.result = 'Error';
    }
  }

  percent() {
    try {
      const val = eval(this.replaceFunctions(this.operation));
      this.operation = (val / 100).toString();
    } catch {
      this.result = 'Error';
    }
  }

  calculate() {
    try {
      const expr = this.replaceFunctions(this.operation);

      // Validar paréntesis
      const open = (expr.match(/\(/g) || []).length;
      const close = (expr.match(/\)/g) || []).length;
      if (open !== close) {
        this.result = 'Error';
        return;
      }

      if (/\/0(?!\d)/.test(expr)) {
        this.result = 'Error';
        return;
      }

      const val = eval(expr);
      this.result = isFinite(val) ? val.toString() : 'Error';
    } catch {
      this.result = 'Error';
    }
  }

  // Reemplazo para funciones científicas
  replaceFunctions(expression: string): string {
    return expression
      .replace(/π/g, 'Math.PI')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/([0-9\.]+)x²/g, 'Math.pow($1, 2)')
      .replace(/([0-9\.]+)\^([0-9\.]+)/g, 'Math.pow($1, $2)');
  }
}
