import styles from './todos.module.scss';

export function Todos() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Todos!</h1>
    </div>
  );
}

export default Todos;
