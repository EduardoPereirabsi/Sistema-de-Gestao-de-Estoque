export function formatarMoeda(valor: number): string {
   return new Intl.NumberFormat('pt-BR', {
     style: 'currency',
     currency: 'BRL',
   }).format(valor);
 }
 
 export function formatarData(data: string): string {
   return new Intl.DateTimeFormat('pt-BR', {
     day: '2-digit',
     month: '2-digit',
     year: 'numeric',
   }).format(new Date(data));
 }
 
 export function formatarDataHora(data: string): string {
   return new Intl.DateTimeFormat('pt-BR', {
     day: '2-digit',
     month: '2-digit',
     year: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
   }).format(new Date(data));
 }
 
 export function formatarCNPJ(cnpj: string): string {
   return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
 }
 
 export function classeStatus(ativo: boolean): string {
   return ativo
     ? 'bg-green-100 text-green-700'
     : 'bg-red-100 text-red-700';
 }