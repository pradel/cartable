const sum = (a, b) => a + b;

describe("sum", () => {
  it("adds two numbers together", () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
