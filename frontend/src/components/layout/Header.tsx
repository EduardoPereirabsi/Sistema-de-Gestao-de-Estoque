import { LogOut, User } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 export default function Header() {
   const navigate = useNavigate();
 
   const handleLogout = () => {
     localStorage.removeItem('token');
     navigate('/login');
   };
 
   return (
     <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
       <div />
       <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 text-sm text-gray-600">
           <User size={16} />
           <span>Minha Conta</span>
         </div>
         <button
           onClick={handleLogout}
           className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
         >
           <LogOut size={16} />
           Sair
         </button>
       </div>
     </header>
   );
 }