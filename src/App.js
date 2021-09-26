import { useEffect, useState } from "react";
import React from "react";
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, buffer, debounceTime, map, filter } from "rxjs/operators";
import styles from "./App.module.css";
const App = () => {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");
  useEffect(
    () => {
      const unsubscribe$ = new Subject();
      interval(1000)
        .pipe(takeUntil(unsubscribe$))
        .subscribe(() => {
          if (status === "run") {
            setSec(val => val + 1000);
          }
        });
      return () => {
        unsubscribe$.next();
        unsubscribe$.complete();
      };
    },
    [status]
  );
  const start = React.useCallback(() => {
    setStatus("run");
    setSec(0);
    // if (status === "wait") {
    //   setSec(0);
    // }
  }, []);

  const stop = React.useCallback(() => {
    setStatus("stop");
    setSec(0);
  }, []);

  const reset = React.useCallback(() => {
    setSec(0);
  }, []);

  const wait = React.useCallback(() => {
    setStatus("wait");
    console.log(status);
    const click$ = fromEvent(document, "click");

    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(30000))),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2)
    );

    const $timer = interval(10000).pipe(takeUntil(doubleClick$));

    $timer.subscribe(console.log);
  }, []);

  return (
    <>
      {" "}
      <div className={styles.main__container}>
        <span> {new Date(sec).toISOString().slice(11, 19)}</span>
        <div className={styles.container}>
          <button onClick={start}>Start</button>
          <button onClick={stop}>Stop</button>
          <button onClick={reset}>Reset</button>
          <button onClick={wait}>Wait</button>
        </div>
      </div>
    </>
  );
};

export default App;
