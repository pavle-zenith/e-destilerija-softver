interface PageHeaderProps {
  naslov: string;
  opis?: string;
  akcija?: React.ReactNode;
}

/** Zaglavlje stranice: naslov, opcioni opis i akcija (dugme) sa desne strane. */
export function PageHeader({ naslov, opis, akcija }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{naslov}</h1>
        {opis ? <p className="mt-1 text-sm text-neutral-500">{opis}</p> : null}
      </div>
      {akcija ? <div className="shrink-0">{akcija}</div> : null}
    </div>
  );
}
