import React from 'react';

type TabName = 'home' | 'planner' | 'anotacoes';

interface HeaderProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const tabs: Array<{ id: TabName; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'planner', label: 'Meu Planner' },
  { id: 'anotacoes', label: 'Anotações' },
];

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <header className="vintage-paper p-6 border-b-2 border-vintage-brown/20">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src="/assets/b186d210-24c0-40a1-a9c8-5f6669a3c00b.png"
            alt="Máquina de escrever PlanMe"
            className="h-16 w-auto filter drop-shadow-md"
          />
        </div>

        <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-2 md:order-none md:w-auto md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`font-vintage text-lg transition-all duration-300 px-4 py-2 rounded-lg ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10 shadow-md'
                  : 'text-vintage-brown hover:text-primary hover:bg-primary/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => onTabChange('anotacoes')}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-lg font-soft font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Nova Anotação
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
