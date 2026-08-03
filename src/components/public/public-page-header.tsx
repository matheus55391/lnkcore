type Props = {
  title: string;
  bio: string | null;
  image: string | null;
};

export function PublicPageHeader({ title, bio, image }: Props) {
  return (
    <>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} className="sp-avatar" />
      )}
      <div>
        <h1 className="sp-name">{title}</h1>
        {bio && <p className="sp-bio">{bio}</p>}
      </div>
    </>
  );
}
