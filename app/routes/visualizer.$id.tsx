import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function Visualizer() {
  const { id } = useParams();
  const location = useLocation();
  const [image, setImage] = useState<string | null>(location.state?.image || null);

  useEffect(() => {
    if (!image && id) {
      const storedImage = sessionStorage.getItem(`roomify_img_${id}`);
      if (storedImage) {
        setImage(storedImage);
      }
    }
  }, [id, image]);

  return (
    <div className="visualizer-page min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Space Visualizer</h1>
            <p className="text-muted-foreground text-lg">
              Project ID: <span className="font-mono text-primary">{id}</span>
            </p>
          </header>
          
          <div className="bg-card rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            {image ? (
              <div className="p-4">
                <div className="relative rounded-xl overflow-hidden border bg-muted aspect-video flex items-center justify-center">
                  <img 
                    src={image} 
                    alt="Uploaded floor plan" 
                    className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105" 
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border shadow-sm">
                      Original Floor Plan
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-dashed flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">Ready for AI processing</span>
                  </div>
                  <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 border-0">
                    Analyze Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Image Found</h3>
                <p className="text-muted-foreground mb-8 max-w-xs">
                  We couldn't find the floor plan for this project session. It might have expired or wasn't uploaded correctly.
                </p>
                <a 
                  href="/#upload" 
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-md transition-all hover:-translate-y-0.5"
                >
                  Return to Upload
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
