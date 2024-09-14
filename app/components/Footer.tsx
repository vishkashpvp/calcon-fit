interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={className}>
      <div className="container ms-5">
        <p>&copy; {new Date().getFullYear()} CalConFit</p>
      </div>
    </footer>
  );
}
