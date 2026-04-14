import { Users } from 'lucide-react';

export default function UsuariosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
      <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center text-gray-400">
        <Users size={48} className="mb-3" />
        <p className="text-lg font-medium">Em desenvolvimento</p>
        <p className="text-sm mt-1">Esta tela será implementada na Sprint 3</p>
      </div>
    </div>
  );
}
