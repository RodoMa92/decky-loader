import type { ToastData } from '@decky/api';
import { joinClassNames } from '@decky/ui';
import { FC, ReactElement, useEffect, useState } from 'react';

import { useDeckyToasterState } from './DeckyToasterState';
import Toast, { toastClasses } from './Toast';

interface DeckyToasterProps {}

interface RenderedToast {
  component: ReactElement;
  data: ToastData;
}

const DeckyToaster: FC<DeckyToasterProps> = () => {
  const { toasts, removeToast } = useDeckyToasterState();
  const [renderedToast, setRenderedToast] = useState<RenderedToast | null>(null);
  console.log(toasts);
  if (toasts.size > 0) {
    const [activeToast] = toasts;
    if (!renderedToast || activeToast != renderedToast.data) {
      // TODO play toast soundReactElement
      console.log('rendering toast', activeToast);
      setRenderedToast({ component: <Toast key={Math.random()} toast={activeToast} />, data: activeToast });
    }
  } else {
    if (renderedToast) setRenderedToast(null);
  }
  useEffect(() => {
    // not actually node but TS is shit
    let interval: number | null;
    if (renderedToast) {
      interval = setTimeout(
        () => {
          interval = null;
          console.log('clear toast', renderedToast.data);
          removeToast(renderedToast.data);
        },
        (renderedToast.data.duration || 5e3) + 1000,
      );
      console.log('set int', interval);
    }
    return () => {
      if (interval) {
        console.log('clearing int', interval);
        clearTimeout(interval);
      }
    };
  }, [renderedToast]);
  return (
    <div className={joinClassNames('deckyToaster', toastClasses.ToastPlaceholder)}>
      {renderedToast && renderedToast.component}
    </div>
  );
};

export default DeckyToaster;
