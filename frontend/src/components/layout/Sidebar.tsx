import { NavLink } from 'react-router-dom';
 import {
   LayoutDashboard, Package, Tags, Truck,
   ArrowLeftRight, Users, BarChart2
 } from 'lucide-react';
 
 const links = [
   { to: '/painel',        label: 'Painel',         icon: LayoutDashboard },
   { to: '/produtos',      label: 'Produtos',        icon: Package },
   { to: '/categorias',    label: 'Categorias',      icon: Tags },
   { to: '/fornecedores',  label: 'Fornecedores',    icon: Truck },
   { to: '/estoque',       label: 'Estoque',         icon: BarChart2 },
   { to: '/movimentacoes', label: 'Movimentações',   icon: ArrowLeftRight },
   { to: '/usuarios',      label: 'Usuários',        icon: Users },
 ];
 
 export default function Sidebar() {
   return (
     <aside className="w-64 bg-white shadow-md flex flex-col">
       <div className="p-6 border-b">
         <h1 className="text-xl font-bold text-blue-600">SmartStock</h1>
         <p className="text-xs text-gray-400 mt-1">Gestão de Estoque</p>
       </div>
       <nav className="flex-1 p-4 space-y-1">
         {links.map(({ to, label, icon: Icon }) => (
           <NavLink
             key={to}
             to={to}
             className={({ isActive }) =>
               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                 isActive
                   ? 'bg-blue-50 text-blue-600 font-medium'
                   : 'text-gray-600 hover:bg-gray-50'
               }`
             }
           >
             <Icon size={18} />
             {label}
           </NavLink>
         ))}
       </nav>
     </aside>
   );
 }