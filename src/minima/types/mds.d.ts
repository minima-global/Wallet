declare namespace MDS {
  let rpchost: string;
  let pollhost: string;
  let logging: boolean;
  let DEBUG_HOST: string;
  let DEBUG_PORT: number | null;
  let DEBUG_MINIDAPPID: string;
  function init(callback: (event: any) => void);
  function log(output: string);
  function cmd(command: string, callback: (data: any) => void);
  interface form {getParams: (param: string) => void}
}