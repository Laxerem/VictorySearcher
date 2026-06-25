import type { VacancyDto } from '@/types/api';
import styles from './VacancyDetail.module.css';

interface Props {
  vacancy: VacancyDto;
}

export function VacancyDetail({ vacancy }: Props) {
  const createdAt = new Date(vacancy.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className={styles.detail}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>{vacancy.title}</h1>
          <div className={styles.sub}>
            <span className={styles.date}>создано {createdAt}</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <p className={styles.text}>{vacancy.description}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Требования</h2>
        <p className={styles.text}>{vacancy.requirements}</p>
      </section>

      {vacancy.extraRequirements && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Дополнительные требования</h2>
          <p className={styles.text}>{vacancy.extraRequirements}</p>
        </section>
      )}
    </div>
  );
}
