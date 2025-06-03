import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Save, X, Plus, Search, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Anotacao {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  dataCreated: string;
  dataModified: string;
}

const AnotacaoList = () => {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([
    {
      id: '1',
      titulo: 'Lista de Compras',
      conteudo: 'Leite, Pão, Ovos, Frutas, Café...',
      categoria: 'Pessoal',
      dataCreated: '2025-01-08',
      dataModified: '2025-01-08'
    },
    {
      id: '2',
      titulo: 'Ideias para o Projeto',
      conteudo: 'Implementar sistema de cores, adicionar sons de máquina de escrever, criar templates...',
      categoria: 'Trabalho',
      dataCreated: '2025-01-07',
      dataModified: '2025-01-08'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const [newAnotacao, setNewAnotacao] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'Pessoal'
  });

  const categorias = ['Todas', 'Pessoal', 'Trabalho', 'Estudos', 'Ideias'];
  const categoriaColors = {
    'Pessoal': 'bg-primary',
    'Trabalho': 'bg-accent',
    'Estudos': 'bg-secondary',
    'Ideias': 'bg-vintage-flower'
  };

  const handleAdd = () => {
    if (!newAnotacao.titulo.trim() || !newAnotacao.conteudo.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha título e conteúdo.",
        variant: "destructive"
      });
      return;
    }

    const anotacao: Anotacao = {
      id: Date.now().toString(),
      titulo: newAnotacao.titulo,
      conteudo: newAnotacao.conteudo,
      categoria: newAnotacao.categoria,
      dataCreated: new Date().toISOString().split('T')[0],
      dataModified: new Date().toISOString().split('T')[0]
    };

    setAnotacoes(prev => [anotacao, ...prev]);
    setNewAnotacao({ titulo: '', conteudo: '', categoria: 'Pessoal' });
    setShowAddForm(false);
    
    toast({
      title: "Anotação criada!",
      description: "Sua anotação foi salva com sucesso.",
    });
  };

  const handleEdit = (anotacao: Anotacao) => {
    setEditingId(anotacao.id);
    setNewAnotacao({
      titulo: anotacao.titulo,
      conteudo: anotacao.conteudo,
      categoria: anotacao.categoria
    });
  };

  const handleSaveEdit = () => {
    setAnotacoes(prev => prev.map(anotacao => 
      anotacao.id === editingId 
        ? {
            ...anotacao,
            titulo: newAnotacao.titulo,
            conteudo: newAnotacao.conteudo,
            categoria: newAnotacao.categoria,
            dataModified: new Date().toISOString().split('T')[0]
          }
        : anotacao
    ));
    
    setEditingId(null);
    setNewAnotacao({ titulo: '', conteudo: '', categoria: 'Pessoal' });
    
    toast({
      title: "Anotação atualizada!",
      description: "Suas alterações foram salvas.",
    });
  };

  const handleDelete = (id: string) => {
    setAnotacoes(prev => prev.filter(anotacao => anotacao.id !== id));
    toast({
      title: "Anotação excluída",
      description: "A anotação foi removida permanentemente.",
    });
  };

  const filteredAnotacoes = anotacoes.filter(anotacao => {
    const matchesSearch = anotacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anotacao.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || anotacao.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header com busca e filtros */}
      <Card className="vintage-paper">
        <CardHeader>
          <CardTitle className="font-vintage text-vintage-brown flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Minhas Anotações</span>
            <Badge variant="secondary" className="ml-auto">
              {filteredAnotacoes.length} anotação{filteredAnotacoes.length !== 1 ? 'ões' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-vintage-brown/50" />
              <Input
                placeholder="Buscar anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-soft"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-vintage-brown/20 bg-card font-soft focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Anotação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de nova anotação */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-brown/40 p-4"
          onClick={() => setShowAddForm(false)}
        >
          <Card
            className="vintage-paper w-full max-w-xl max-h-[90vh] overflow-y-auto border-primary/50"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="font-vintage text-vintage-brown flex items-center justify-between gap-4">
                <span>✨ Nova Anotação</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título da anotação..."
                  value={newAnotacao.titulo}
                  onChange={(e) => setNewAnotacao(prev => ({ ...prev, titulo: e.target.value }))}
                  className="font-soft"
                />
                <select
                  value={newAnotacao.categoria}
                  onChange={(e) => setNewAnotacao(prev => ({ ...prev, categoria: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-vintage-brown/20 bg-card font-soft focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categorias.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Digite o conteúdo da sua anotação aqui..."
                value={newAnotacao.conteudo}
                onChange={(e) => setNewAnotacao(prev => ({ ...prev, conteudo: e.target.value }))}
                className="min-h-32 font-soft"
              />
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="font-soft"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdd}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-soft"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Anotação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de anotações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnotacoes.map(anotacao => (
          <Card key={anotacao.id} className="vintage-paper hover:shadow-lg transition-all duration-300 group">
            {editingId === anotacao.id ? (
              <CardContent className="p-6 space-y-4">
                <Input
                  value={newAnotacao.titulo}
                  onChange={(e) => setNewAnotacao(prev => ({ ...prev, titulo: e.target.value }))}
                  className="font-soft"
                />
                <select
                  value={newAnotacao.categoria}
                  onChange={(e) => setNewAnotacao(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-vintage-brown/20 bg-card font-soft focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categorias.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Textarea
                  value={newAnotacao.conteudo}
                  onChange={(e) => setNewAnotacao(prev => ({ ...prev, conteudo: e.target.value }))}
                  className="min-h-24 font-soft"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(null)}
                    className="font-soft"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-soft"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="min-w-0 flex-1 break-words font-vintage text-lg text-vintage-brown group-hover:text-primary transition-colors duration-300">
                      {anotacao.titulo}
                    </CardTitle>
                    <div className="flex shrink-0 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(anotacao)}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(anotacao.id)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge 
                      className={`${categoriaColors[anotacao.categoria as keyof typeof categoriaColors]} text-white font-soft text-xs`}
                    >
                      {anotacao.categoria}
                    </Badge>
                    <span className="text-xs text-vintage-brown/70 font-soft">
                      {anotacao.dataModified}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="break-words text-vintage-brown font-soft text-sm leading-relaxed">
                    {anotacao.conteudo.length > 120 
                      ? `${anotacao.conteudo.substring(0, 120)}...` 
                      : anotacao.conteudo
                    }
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredAnotacoes.length === 0 && (
        <Card className="vintage-paper">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-vintage-brown/30" />
            <h3 className="font-vintage text-xl text-vintage-brown mb-2">
              Nenhuma anotação encontrada
            </h3>
            <p className="text-vintage-brown/70 font-soft mb-4">
              {searchTerm || filterCategory !== 'Todas' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira anotação!'
              }
            </p>
            {!searchTerm && filterCategory === 'Todas' && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Anotação
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnotacaoList;
