export function GoogleButton({ label }: { label: string }) {
  return (
    <a
      href={`${import.meta.env.VITE_API_URL ?? '/api'}/auth/google`}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
    >
      <span className="h-[18px] w-[18px] bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 48 48%27%3E%3Cpath fill=%27%234285F4%27 d=%27M44 24.5c0-1.6-.14-2.85-.45-4.09H24v7.41h11.28c-.6 3.18-2.4 5.88-5.1 7.69v6.35h8.26c4.83-4.45 7.61-11 7.61-18.36z%27/%3E%3Cpath fill=%27%2334A853%27 d=%27M24 44c6.84 0 12.58-2.26 16.77-6.15l-8.26-6.35c-2.29 1.53-5.22 2.44-8.51 2.44-6.54 0-12.08-4.41-14.06-10.35H1.29v6.55C5.42 39.51 14.03 44 24 44z%27/%3E%3Cpath fill=%27%23FBBC05%27 d=%27M9.94 23.49c-.5-1.53-.78-3.16-.78-4.84s.28-3.31.78-4.84V7.26H1.29C-.43 10.69-1.43 14.61-1.43 18.65s1 7.96 2.72 11.39l8.65-6.55z%27/%3E%3Cpath fill=%27%23EA4335%27 d=%27M24 9.58c3.72 0 6.28 1.61 7.72 2.95l5.64-5.64C36.56 3.89 30.84 1.43 24 1.43 14.03 1.43 5.42 5.92 1.29 13.21l8.65 6.55c1.98-5.94 7.52-10.18 14.06-10.18z%27/%3E%3C/svg%3E')] bg-contain bg-center bg-no-repeat" />
      {label}
    </a>
  )
}
