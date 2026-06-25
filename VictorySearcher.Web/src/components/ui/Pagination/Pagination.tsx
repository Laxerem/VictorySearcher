import styles from './Pagination.module.css';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ← Назад
      </button>
      <span className={styles.info}>
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Вперёд →
      </button>
    </div>
  );
}
