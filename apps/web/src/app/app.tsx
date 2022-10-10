import styles from './app.module.scss';
import { Todo } from '@supreme-adventure/data';
import { Ui, Todos } from '@supreme-adventure/ui';
import { useEffect, useState } from 'react';

export function App() {
  const [obj, setObj] = useState<Todo | null>(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((obj) => setObj(obj));
  }, []);

  return (
    <>
      <h1 className={styles['title']}>Hi, mom!</h1>
      <div>{obj ? obj.title : 'Loading'}</div>
      <Ui />
      <Todos />
    </>
  );
}

export default App;
