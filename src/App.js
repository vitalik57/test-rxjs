import { useEffect, useState } from "react";
import React from "react";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import styles from "./App.module.css";
import { useRef } from "react";
import useDoubleClick from "use-double-click";
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
  }, []);

  const stop = React.useCallback(() => {
    setStatus("stop");
    setSec(0);
  }, []);

  const reset = React.useCallback(() => {
    setSec(0);
  }, []);
  const wait = useRef();

  useDoubleClick({
    onDoubleClick: e => {
      setStatus("wait");
    },
    ref: wait,
    latency: 300
  });
  return (
    <>
      {" "}
      <div className={styles.main__container}>
        <span> {new Date(sec).toISOString().slice(11, 19)}</span>
        <div className={styles.container}>
          <button onClick={start}>Start</button>
          <button onClick={stop}>Stop</button>
          <button onClick={reset}>Reset</button>
          <button ref={wait}>Wait</button>
        </div>
      </div>
    </>
  );
};

export default App;
