import { ResetAccent } from "./reset-accent";

const resetScript = `try{var s=document.documentElement.style;['--accent-violet','--bar-fill','--primary','--primary-foreground','--ring'].forEach(function(v){s.removeProperty(v)})}catch(e){}`;

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: resetScript }} />
      <ResetAccent />
      {children}
    </>
  );
}
