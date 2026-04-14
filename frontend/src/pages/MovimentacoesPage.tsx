import { ArrowLeftRight } from 'lucide-react';

export default function MovimentacoesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Movimentações</h1>
      <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center text-gray-400">
        <ArrowLeftRight size={48} className="mb-3" />
        <p className="text-lg font-medium">Em desenvolvimento</p>
        <p className="text-sm mt-1">Esta tela será implementada na Sprint 3</p>
      </div>
    </div>
  );
}
