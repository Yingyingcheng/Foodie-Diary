type CatBadgeProps = {
  src: string;
  ringColor: string;
};

/* Round cat portrait with a colored ring, same size as the login page cat */
export function CatBadge({ src, ringColor }: CatBadgeProps) {
  return (
    <img
      src={src}
      alt=""
      className="block mx-auto w-[200px] max-w-[80%] aspect-square rounded-full object-cover object-top border-2 shadow-md select-none"
      style={{ borderColor: ringColor }}
    />
  );
}
