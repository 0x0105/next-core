import { GeneralTransform } from "@easyops/brick-types";
import { evaluate } from "./evaluate";
import { preprocessTransformProperties } from "./transformProperties";

export const MESSAGE_SOURCE_PANEL = "brick-next-devtools-panel";
export const EVALUATION_EDIT = "devtools-evaluation-edit";
export const TRANSFORMATION_EDIT = "devtools-transformation-edit";

interface DevtoolsHookContainer {
  __BRICK_NEXT_DEVTOOLS_HOOK__?: DevtoolsHook;
}

interface DevtoolsHook {
  emit: (message: any) => void;
}

/* istanbul ignore next */
export function devtoolsHookEmit(type: string, payload?: any): void {
  Promise.resolve().then(() => {
    const devHook = (window as DevtoolsHookContainer)
      .__BRICK_NEXT_DEVTOOLS_HOOK__;
    devHook?.emit?.({
      type,
      payload,
    });
  });
}

export function listenDevtools(): void {
  window.addEventListener("message", (event: MessageEvent): void => {
    if (
      event.data?.source === MESSAGE_SOURCE_PANEL &&
      event.data.payload?.type === EVALUATION_EDIT
    ) {
      let result;
      const { raw, context, id } = event.data.payload;
      if (context.event && raw.includes("EVENT")) {
        result = "`EVENT` is not supported debugging temporarily";
      } else {
        try {
          result = evaluate(raw, context, { disabledNotifyDevTools: true });
        } catch (e) {
          result = e.message;
        }
      }

      devtoolsHookEmit("re-evaluation", { raw, result, id });
    }

    if (
      event.data?.source === MESSAGE_SOURCE_PANEL &&
      event.data.payload?.type === TRANSFORMATION_EDIT
    ) {
      let result;
      const {
        data,
        transform,
        id,
        options: { from, mapArray },
      } = event.data.payload;
      try {
        result = reProcessTransform(data, transform, from, mapArray);
      } catch (e) {
        result = {
          result: e.message,
        };
      }

      devtoolsHookEmit("re-transformation", {
        ...result,
        id,
      });
    }
  });
}

export function reProcessTransform(
  data: any,
  to: GeneralTransform,
  from?: string | string[],
  mapArray?: boolean | "auto"
) {
  const output = preprocessTransformProperties(data, to, from, mapArray, {
    disabledNotifyDevTools: true,
  });
  return {
    transform: to,
    result: output,
  };
}
