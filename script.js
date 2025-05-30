// PlanMe - JavaScript Puro
class PlanMe {
    constructor() {
        this.currentDate = new Date();
        this.activeTab = 'home';
        this.visitCount = 0;
        this.notes = [
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
        ];
        this.events = [
            {
                id: '1',
                title: 'Reunião importante',
                date: '2025-01-15',
                type: 'compromisso',
                color: 'primary',
                description: 'Compromisso importante do dia.'
            },
            {
                id: '2',
                title: 'Aniversário da mamãe',
                date: '2025-01-20',
                type: 'lembrete',
                color: 'secondary',
                description: 'Lembrar de preparar uma surpresa com carinho.'
            }
        ];
        this.holidays = [];
        this.loadedHolidayYears = new Set();
        this.selectedAgendaDate = null;
        this.searchTerm = '';
        this.filterCategory = 'Todas';
        
        this.init();
    }

    init() {
        this.loadVisitCount();
        this.loadEvents();
        this.setupEventListeners();
        this.generateCalendar();
        this.renderNotes();
        this.initLucideIcons();
    }

    initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadVisitCount() {
        const saved = localStorage.getItem('planme_visit_count');
        this.visitCount = saved ? parseInt(saved) + 1 : 1;
        localStorage.setItem('planme_visit_count', this.visitCount.toString());
        
        const countElement = document.getElementById('visit-count');
        if (countElement) {
            countElement.textContent = this.visitCount;
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-notes');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.renderNotes();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterCategory = e.target.value;
                this.renderNotes();
            });
        }

        // Form inputs
        const noteTitle = document.getElementById('note-title');
        const noteContent = document.getElementById('note-content');
        const noteCategory = document.getElementById('note-category');

        if (noteTitle) noteTitle.addEventListener('input', this.validateForm.bind(this));
        if (noteContent) noteContent.addEventListener('input', this.validateForm.bind(this));

        const agendaForm = document.getElementById('agenda-form');
        if (agendaForm) {
            agendaForm.addEventListener('submit', this.saveAgendaItem.bind(this));
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAgendaModal();
                this.closeNewNoteModal();
            }
        });
    }

    validateForm() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        // Additional validation logic can be added here
    }

    showTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        // Hide all tab buttons
        const tabButtons = document.querySelectorAll('.nav-tab');
        tabButtons.forEach(button => button.classList.remove('active'));

        // Show selected tab content
        const selectedContent = document.getElementById(`content-${tabName}`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }

        // Show selected tab button
        const selectedButton = document.getElementById(`tab-${tabName}`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        this.activeTab = tabName;

        // Re-initialize icons when tab changes
        setTimeout(() => {
            this.initLucideIcons();
        }, 100);
    }

    navigateMonth(direction) {
        if (direction === 'prev') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.generateCalendar();
    }

    generateCalendar() {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        // Update month/year display
        const monthYearElement = document.getElementById('current-month-year');
        if (monthYearElement) {
            monthYearElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }

        // Generate calendar days
        const daysContainer = document.getElementById('calendar-days');
        if (!daysContainer) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDay = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        [...new Set(days.map(day => day.getFullYear()))].forEach(year => {
            this.loadHolidaysForYear(year);
        });

        daysContainer.innerHTML = '';

        days.forEach(day => {
            const dayElement = this.createDayElement(day);
            daysContainer.appendChild(dayElement);
        });
    }

    createDayElement(date) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
        const isToday = this.isToday(date);

        if (!isCurrentMonth) {
            dayDiv.classList.add('other-month');
        }
        if (isToday) {
            dayDiv.classList.add('today');
        }

        const dateStr = this.formatDate(date);
        if (isCurrentMonth) {
            dayDiv.onclick = (event) => {
                if (event.target.closest('button, .event')) return;
                this.openAgendaModal(dateStr);
            };
        }

        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayDiv.appendChild(dayNumber);

        // Events for this day
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        const dayEvents = this.getEventsForDate(date);
        dayEvents.slice(0, 2).forEach(event => {
            const meta = this.getAgendaMeta(event.type);
            const eventDiv = document.createElement('div');
            eventDiv.className = `event ${meta.color}`;
            eventDiv.textContent = `${meta.label}: ${event.title}`;
            eventDiv.title = event.description ? `${event.title} - ${event.description}` : event.title;
            eventDiv.onclick = (clickEvent) => {
                clickEvent.stopPropagation();
                this.openAgendaModal(dateStr);
            };
            eventsContainer.appendChild(eventDiv);
        });

        if (dayEvents.length > 2) {
            const moreDiv = document.createElement('div');
            moreDiv.className = 'day-events-more';
            moreDiv.textContent = `+${dayEvents.length - 2} mais`;
            eventsContainer.appendChild(moreDiv);
        }

        dayDiv.appendChild(eventsContainer);

        // Add event button
        if (isCurrentMonth) {
            const addButton = document.createElement('button');
            addButton.className = 'add-event';
            addButton.type = 'button';
            addButton.title = 'Adicionar item na agenda';
            addButton.innerHTML = '<i data-lucide="plus"></i>';
            addButton.onclick = (event) => {
                event.stopPropagation();
                this.openAgendaModal(dateStr);
            };
            dayDiv.appendChild(addButton);
        }

        return dayDiv;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getEventsForDate(date) {
        const dateStr = this.formatDate(date);
        return [
            ...this.events.filter(event => event.date === dateStr),
            ...this.holidays.filter(holiday => holiday.date === dateStr)
        ];
    }

    showAddEventModal(date) {
        this.openAgendaModal(this.formatDate(date));
    }

    loadEvents() {
        const saved = localStorage.getItem('planme_agenda_items');
        if (!saved) return;

        try {
            const parsedEvents = JSON.parse(saved);
            if (Array.isArray(parsedEvents)) {
                this.events = parsedEvents;
            }
        } catch (error) {
            console.warn('Não foi possível carregar a agenda salva.', error);
        }
    }

    saveEvents() {
        localStorage.setItem('planme_agenda_items', JSON.stringify(this.events));
    }

    async loadHolidaysForYear(year) {
        if (this.loadedHolidayYears.has(year)) return;
        this.loadedHolidayYears.add(year);

        try {
            const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            const holidays = await response.json();
            const holidayItems = holidays.map(holiday => ({
                id: `holiday-${year}-${holiday.date}`,
                title: holiday.name,
                date: holiday.date,
                type: 'feriado',
                color: 'holiday',
                description: 'Feriado nacional',
                source: 'holiday'
            }));

            this.holidays = [
                ...this.holidays.filter(holiday => !holiday.id.startsWith(`holiday-${year}-`)),
                ...holidayItems
            ];

            this.generateCalendar();
            if (this.selectedAgendaDate?.startsWith(`${year}-`)) {
                this.renderAgendaDayItems();
            }
        } catch (error) {
            console.warn(`Não foi possível carregar feriados de ${year}.`, error);
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDisplayDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    getAgendaMeta(type) {
        const options = {
            compromisso: { label: 'Compromisso', color: 'primary' },
            tarefa: { label: 'Tarefa', color: 'task' },
            lista: { label: 'Lista', color: 'list' },
            livro: { label: 'Livro lido', color: 'book' },
            lembrete: { label: 'Lembrete', color: 'accent' },
            feriado: { label: 'Feriado nacional', color: 'holiday' }
        };

        return options[type] || options.compromisso;
    }

    openAgendaModal(dateStr) {
        this.selectedAgendaDate = dateStr;

        const modal = document.getElementById('agenda-modal');
        const dateElement = document.getElementById('agenda-selected-date');
        const titleInput = document.getElementById('agenda-title');
        const descriptionInput = document.getElementById('agenda-description');
        const typeSelect = document.getElementById('agenda-type');

        if (!modal) return;

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');

        if (dateElement) {
            dateElement.textContent = `Dia ${this.formatDisplayDate(dateStr)}`;
        }
        if (titleInput) titleInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        if (typeSelect) typeSelect.value = 'tarefa';

        this.renderAgendaDayItems();
        this.initLucideIcons();

        setTimeout(() => titleInput?.focus(), 50);
    }

    closeAgendaModal() {
        const modal = document.getElementById('agenda-modal');
        if (!modal) return;

        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        this.selectedAgendaDate = null;
    }

    saveAgendaItem(event) {
        event.preventDefault();

        if (!this.selectedAgendaDate) return;

        const title = document.getElementById('agenda-title').value.trim();
        const type = document.getElementById('agenda-type').value;
        const description = document.getElementById('agenda-description').value.trim();

        if (!title) {
            this.showToast('Título obrigatório', 'Escreva um título para salvar na agenda.', 'error');
            return;
        }

        const meta = this.getAgendaMeta(type);
        this.events.push({
            id: Date.now().toString(),
            title,
            type,
            date: this.selectedAgendaDate,
            color: meta.color,
            description
        });

        this.saveEvents();
        this.generateCalendar();
        this.renderAgendaDayItems();

        document.getElementById('agenda-title').value = '';
        document.getElementById('agenda-description').value = '';
        document.getElementById('agenda-title').focus();

        this.showToast('Item salvo na agenda!', 'Você pode adicionar listas, tarefas, livros e descrições.');
    }

    deleteAgendaItem(id) {
        this.events = this.events.filter(event => event.id !== id);
        this.saveEvents();
        this.generateCalendar();
        this.renderAgendaDayItems();
        this.showToast('Item removido', 'O item foi removido da agenda.');
    }

    renderAgendaDayItems() {
        const container = document.getElementById('agenda-day-items');
        if (!container || !this.selectedAgendaDate) return;

        const items = [
            ...this.events.filter(event => event.date === this.selectedAgendaDate),
            ...this.holidays.filter(holiday => holiday.date === this.selectedAgendaDate)
        ];

        if (items.length === 0) {
            container.innerHTML = '<p class="agenda-empty font-soft">Nenhum item neste dia ainda.</p>';
            return;
        }

        container.innerHTML = `
            <h3 class="font-vintage agenda-list-title">Itens do dia</h3>
            ${items.map(item => {
                const meta = this.getAgendaMeta(item.type);
                return `
                    <div class="agenda-item ${meta.color}">
                        <div>
                            <div class="agenda-item-heading">
                                <span class="category-badge ${meta.color}">${meta.label}</span>
                                <strong>${this.escapeHtml(item.title)}</strong>
                            </div>
                            ${item.description ? `<p class="font-soft">${this.escapeHtml(item.description)}</p>` : ''}
                        </div>
                        ${item.source === 'holiday' ? '' : `
                            <button type="button" class="btn btn-ghost btn-sm" onclick="planMe.deleteAgendaItem('${item.id}')">
                                <i data-lucide="trash-2"></i>
                            </button>
                        `}
                    </div>
                `;
            }).join('')}
        `;

        this.initLucideIcons();
    }

    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    openNewNoteModal() {
        this.showTab('anotacoes');

        const form = document.getElementById('add-note-form');
        if (form) {
            form.classList.remove('hidden');
            form.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            // Clear form
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            document.getElementById('note-category').value = 'Pessoal';
            setTimeout(() => document.getElementById('note-title')?.focus(), 50);
        }
    }

    closeNewNoteModal() {
        const form = document.getElementById('add-note-form');
        if (form) {
            form.classList.add('hidden');
            form.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        }
    }

    saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const category = document.getElementById('note-category').value;

        if (!title || !content) {
            this.showToast('Campos obrigatórios', 'Por favor, preencha título e conteúdo.', 'error');
            return;
        }

        const note = {
            id: Date.now().toString(),
            titulo: title,
            conteudo: content,
            categoria: category,
            dataCreated: new Date().toISOString().split('T')[0],
            dataModified: new Date().toISOString().split('T')[0]
        };

        this.notes.unshift(note);
        this.renderNotes();
        this.closeNewNoteModal();
        this.showToast('Anotação criada!', 'Sua anotação foi salva com sucesso.');
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        // Placeholder for edit functionality
        this.showToast('Funcionalidade em desenvolvimento', 'Em breve você poderá editar anotações!');
    }

    deleteNote(id) {
        if (confirm('Tem certeza que deseja excluir esta anotação?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.renderNotes();
            this.showToast('Anotação excluída', 'A anotação foi removida permanentemente.');
        }
    }

    renderNotes() {
        const filteredNotes = this.getFilteredNotes();
        const notesGrid = document.getElementById('notes-grid');
        const emptyState = document.getElementById('empty-state');
        const notesCount = document.getElementById('notes-count');

        if (!notesGrid || !emptyState || !notesCount) return;

        // Update count
        notesCount.textContent = `${filteredNotes.length} anotação${filteredNotes.length !== 1 ? 'ões' : ''}`;

        if (filteredNotes.length === 0) {
            notesGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            
            // Update empty state message
            const emptyText = emptyState.querySelector('.empty-text');
            if (emptyText) {
                emptyText.textContent = this.searchTerm || this.filterCategory !== 'Todas' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Comece criando sua primeira anotação!';
            }
        } else {
            notesGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');

            notesGrid.innerHTML = '';
            filteredNotes.forEach(note => {
                const noteElement = this.createNoteElement(note);
                notesGrid.appendChild(noteElement);
            });
        }

        // Re-initialize icons
        this.initLucideIcons();
    }

    createNoteElement(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'card vintage-paper note-card';

        const categoryClass = note.categoria.toLowerCase();
        const truncatedContent = note.conteudo.length > 120 
            ? `${note.conteudo.substring(0, 120)}...` 
            : note.conteudo;

        noteDiv.innerHTML = `
            <div class="note-header">
                <h3 class="note-title font-vintage">${note.titulo}</h3>
                <div class="note-actions">
                    <button class="btn btn-ghost btn-sm" onclick="planMe.editNote('${note.id}')">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="planMe.deleteNote('${note.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="note-meta">
                <span class="category-badge ${categoryClass}">${note.categoria}</span>
                <span class="note-date font-soft">${note.dataModified}</span>
            </div>
            <div class="note-content">
                <p class="font-soft">${truncatedContent}</p>
            </div>
        `;

        return noteDiv;
    }

    getFilteredNotes() {
        return this.notes.filter(note => {
            const matchesSearch = note.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                 note.conteudo.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = this.filterCategory === 'Todas' || note.categoria === this.filterCategory;
            return matchesSearch && matchesCategory;
        });
    }

    showToast(title, description, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
let planMe;

function showTab(tabName) {
    planMe.showTab(tabName);
}

function navigateMonth(direction) {
    planMe.navigateMonth(direction);
}

function openNewNoteModal() {
    planMe.openNewNoteModal();
}

function closeNewNoteModal() {
    planMe.closeNewNoteModal();
}

function closeAgendaModal() {
    planMe.closeAgendaModal();
}

function saveNote() {
    planMe.saveNote();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    planMe = new PlanMe();
});
