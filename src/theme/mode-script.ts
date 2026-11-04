/** localStorage key for the page mode; theme/mode.ts reads and writes it. */
export const PAGE_MODE_KEY = "page-mode";

/**
 * Runs inline before first paint, so a saved red page never flashes cream.
 * Keep it in sync with `setPageMode` in theme/mode.ts.
 */
export const pageModeScript = `try{if(localStorage.getItem("${PAGE_MODE_KEY}")==="red")document.documentElement.dataset.theme="red"}catch(e){}`;
