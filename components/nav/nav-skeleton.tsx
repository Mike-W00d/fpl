export function NavSkeleton() {
  return (
    <>
      <nav className="hidden border-b bg-background md:block">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <span className="text-lg font-semibold">FplTablePro</span>
        </div>
      </nav>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="flex h-[60px] items-center justify-around" />
      </nav>
    </>
  );
}
