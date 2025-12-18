function DisplayCard({
  className = '',
  resetClass = false,
  children = (
    <>
      <div className=''>
        <h3 className='font-bold mb-2 ubuntu-font text-2xl'>
          Something Coming Soon
        </h3>
        <p className='text-muted-foreground'>
          This section is under development. Please check back later for
          updates.
        </p>
      </div>
    </>
  ),
}: {
  className?: String;
  resetClass?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${className} p-5 min-h-[250px] rounded-2xl transition-all duration-300 ${
        !resetClass &&
        'bg-card text-card-foreground border border-border shadow-sm hover:shadow-md'
      }`}
    >
      {children}
    </div>
  );
}

export default DisplayCard;
