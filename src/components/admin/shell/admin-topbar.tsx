import { Icon } from '@/components/ui/icon';

export function AdminTopbar() {
  return (
    <div className="flex items-center justify-end gap-8 border-b border-line bg-paper px-10 py-3.5">
      <button
        type="button"
        className="relative cursor-pointer p-2 text-ink-60 hover:text-ink"
        aria-label="Notificações"
      >
        <Icon name="bell" size={18} />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-sale" />
      </button>
    </div>
  );
}
