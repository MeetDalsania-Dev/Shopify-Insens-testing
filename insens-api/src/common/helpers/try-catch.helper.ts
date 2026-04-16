type Success<T> = { data: T; error: null };
type Failure = { data: null; error: Error };
type Result<T> = Success<T> | Failure;
export async function tryCatch<T>(fn: Promise<T>, context?: string): Promise<Result<T>> {
  try {
    const data = await fn;
    return { data, error: null };
  } catch (err) {
    const message = context
      ? `[${context}] ${err instanceof Error ? err.message : String(err)}`
      : String(err);

    return { data: null, error: new Error(message) };
  }
}

// Usage
// const { data, error } = await tryCatch(
//   this.db.insert(schema.products).values(data).returning(),
//   'ProductService.create',
// );
