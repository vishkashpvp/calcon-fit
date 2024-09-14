import Footer from "./components/Footer";
import Header from "./components/Header";
import LandingPage from "./LandingPage";

export default function Home() {
  return (
    <div className="min-h-dvh font-[family-name:var(--font-geist-sans)]">
      <Header className="py-4" />
      <main>
        <LandingPage />
      </main>
      <Footer className="py-4" />
    </div>
  );
}
