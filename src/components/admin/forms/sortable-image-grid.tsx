'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@/components/ui/icon';

interface ImageItem {
  id: string;
  url: string;
  alt: string | null;
  variantId: string | null;
}

interface Props {
  images: ImageItem[];
  orderedIds: string[];
  onReorder: (newOrder: string[]) => void;
  onDelete: (imageId: string) => void;
}

export function SortableImageGrid({ images, orderedIds, onReorder, onDelete }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(orderedIds, oldIndex, newIndex);
    onReorder(next);
  }

  // Resolve images on the fly seguindo a ordem visual atual
  const imagesById = new Map(images.map((i) => [i.id, i]));
  const orderedImages = orderedIds
    .map((id) => imagesById.get(id))
    .filter((x): x is ImageItem => !!x);

  if (orderedImages.length === 0) {
    return (
      <div className="text-body-sm text-ink-60">Nenhuma imagem. Faça upload abaixo.</div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {orderedImages.map((img) => (
            <SortableImage key={img.id} image={img} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableImage({
  image,
  onDelete,
}: {
  image: ImageItem;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-[4/5] border border-line bg-cream"
    >
      <img src={image.url} alt={image.alt ?? ''} className="size-full object-cover" />
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 grid size-7 cursor-grab place-items-center bg-paper/95 text-ink-60 active:cursor-grabbing"
        aria-label="Arrastar"
      >
        <Icon name="menu" size={14} />
      </button>
      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(image.id)}
        className="absolute top-2 right-2 grid size-7 place-items-center bg-paper/95 text-ink-60 hover:text-sale"
        aria-label="Remover"
      >
        <Icon name="trash" size={12} />
      </button>
      {image.variantId && (
        <span className="absolute bottom-1 left-1 right-1 truncate bg-ink/70 px-1.5 py-0.5 text-[10px] text-paper">
          ↳ variante
        </span>
      )}
    </div>
  );
}
