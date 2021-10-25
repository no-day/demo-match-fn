type Fn<A, B> = (x: A) => B;

type FnOrOutput<A, B> = Fn<A, B> | B;

type FnOrInput<A, B> = Fn<A, B> | A;

export type MatchAPI<A, B> = {
  on: (pred: FnOrInput<A, boolean>, then: FnOrOutput<A, B>) => MatchAPI<A, B>;
  otherwise: (then: FnOrOutput<A, B>) => B;
};

const normalizeToConst = <A, B>(x: FnOrOutput<A, B>) =>
  (typeof x === "function" ? x : () => x) as Fn<A, B>;

const normalizeToPred = <A, B>(x: FnOrInput<A, B>) =>
  (typeof x === "function" ? x : (a: A) => x === a) as Fn<A, boolean>;

const matched = <A, B>(b: B): MatchAPI<A, B> => ({
  on: () => matched(b),
  otherwise: () => b,
});

export const match = <A, B>(a: A): MatchAPI<A, B> => ({
  on: (pred, then) => {
    const pred_ = normalizeToPred(pred);
    const then_ = normalizeToConst(then);
    return pred_(a) ? matched(then_(a)) : match(a);
  },
  otherwise: then => {
    const then_ = normalizeToConst(then);
    return then_(a);
  },
});
