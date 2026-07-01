import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { VacancyRow, CreateVacancyWizard, useVacancies, useVacancyCreate } from '@/features/scoring';
import styles from './ScoringPage.module.css';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
    <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

export function ScoringPage() {
  const { items, total, totalResumes, isLoading } = useVacancies();
  const { dialogOpen, openDialog, closeDialog, handleCreate, isCreating, createError } = useVacancyCreate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  // Open the wizard when arriving via the header action (`/scoring?create=1`).
  useEffect(() => {
    if (searchParams.get('create') === '1') {
      openDialog();
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((v) => v.title.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <AppLayout breadcrumb={<span>Вакансии</span>}>
      <div className={styles.page}>
        <section className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Подбор персонала</span>
            <h1 className={styles.title}>Вакансии</h1>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{total}</div>
              <div className={styles.statLabel}>всего</div>
            </div>
            <div className={styles.statSep} />
            <div className={styles.stat}>
              <div className={styles.statValue}>{totalResumes}</div>
              <div className={styles.statLabel}>резюме</div>
            </div>
          </div>
        </section>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}><SearchIcon /></span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по названию вакансии"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.list}>
          {isLoading && (
            <>
              <div className={styles.rowSkeleton} />
              <div className={styles.rowSkeleton} />
              <div className={styles.rowSkeleton} />
            </>
          )}
          {!isLoading && filtered.map((vacancy) => (
            <VacancyRow key={vacancy.id} vacancy={vacancy} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className={styles.empty}>Вакансии не найдены</div>
          )}
        </div>
      </div>

      <CreateVacancyWizard
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
        error={createError}
      />
    </AppLayout>
  );
}
