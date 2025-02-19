import React, { Fragment, useCallback } from "react";
import { createPortal } from "react-dom";

const arcaptchaCallBack = "arcaptchaCallBack";

function Captcha({ onSubmit }: { onSubmit: (token: string) => void }) {
  const captchaScript = (
    <script src="https://widget.arcaptcha.ir/1/api.js" async defer></script>
  );
  const portal = createPortal(captchaScript, document.body);

  const captchaCallBack = useCallback(
    function captchaCallBack(captchaToken: string) {
      onSubmit(captchaToken);
    },
    [onSubmit]
  );

  window[arcaptchaCallBack] = captchaCallBack;

  return (
    <Fragment>
      <div
        dir="rtl"
        className="text-center arcaptcha"
        data-site-key="ih2deaht3h"
        data-callback={arcaptchaCallBack}
      ></div>
      {portal}
    </Fragment>
  );
}

export default React.memo(Captcha);

declare global {
  interface Window {
    [arcaptchaCallBack]: (captchaToken: string) => void;
  }
}
