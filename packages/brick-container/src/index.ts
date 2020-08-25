import "moment";
import "moment/locale/zh-cn";
import { createRuntime, handleHttpError } from "@easyops/brick-kit";
import { pushInterceptor } from "@easyops/brick-http";
import { initializeLibrary } from "@easyops/fontawesome-library";
import "./i18n";

import "./antd";
import "./styles/variables.css";
import "./styles/antd.less";
import "./styles/antd-compatible.less";
import "./styles/default.css";

initializeLibrary();

// These constants bellow are defined by `webpack.DefinePlugin`.
// eslint-disable-next-line
// @ts-ignore
window.DLL_HASH = DLL_HASH;
// eslint-disable-next-line
// @ts-ignore
window.BRICK_NEXT_VERSIONS = BRICK_NEXT_VERSIONS;
// eslint-disable-next-line
// @ts-ignore
window.BRICK_NEXT_FEATURES = BRICK_NEXT_FEATURES;

const root = document.body;

const pluginRuntime = createRuntime();

const mountPoints = {
  menuBar: root.querySelector<HTMLElement>("#menu-bar-mount-point"),
  appBar: root.querySelector<HTMLElement>("#app-bar-mount-point"),
  loadingBar: root.querySelector<HTMLElement>("#loading-bar-mount-point"),
  main: root.querySelector<HTMLElement>("#main-mount-point"),
  bg: root.querySelector<HTMLElement>("#bg-mount-point"),
  portal: root.querySelector<HTMLElement>("#portal-mount-point"),
};

pushInterceptor((req, next, interceptorParams?) => {
  if (interceptorParams && interceptorParams.ignoreLoadingBar) {
    return next(req);
  }
  window.dispatchEvent(new CustomEvent("request.start"));
  return next(req).finally(() => {
    window.dispatchEvent(new CustomEvent("request.end"));
  });
});

async function bootstrap(): Promise<void> {
  try {
    await pluginRuntime.bootstrap(mountPoints);
  } catch (e) {
    handleHttpError(e);
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

bootstrap();
