import { Todos } from '@supreme-adventure/ui';

import styles from './app.module.scss';

export function App() {
  return (
    <>
      <h1 className={styles['title']}>Hi, mom!</h1>
      <Todos />
    </>
  );
}

export default App;
