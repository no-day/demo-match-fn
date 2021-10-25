import { match } from "./src/match";

const res = match<number, string>(30)
  .on(10, "A")
  .on(20, "B")
  .on(30, n => `C: ${n.toString()}`)
  .on(n => n > 40, "D")
  .otherwise("Z");
